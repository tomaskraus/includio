import {logger} from './common';
import {defaultIfNullOrUndefined} from '../utils';
import {from, filter, scan, map} from 'rxjs';
import {switchTrueFalse} from 'stateful-predicates';
import {splitIf} from 'split-if';
import {createStartTag} from '@krausoft/comment-regexp-builder';
import {cacheOneArgFnAsync} from '../utils';

const log = logger('includo:markMapProvider');

const createGetMarkNameFromLine = (tagName: string) => {
  const beginMarkTagInfo = createStartTag(tagName);
  return (line: string): string => {
    const name = defaultIfNullOrUndefined('')(
      beginMarkTagInfo.innerText(line)
    ).trim();
    // if (name.length === 0) {
    //   throw new Error('Empty mark name!');
    // }
    return name;
  };
};

export const createMarkMapProvider = (
  fileContentProvider: (filename: string) => Promise<string>,
  markTagProvider: (filename: string) => [string, string]
) => {
  log('CREATE markMapProvider');

  const _getMapFromFile = async (
    marksFileName: string
  ): Promise<Map<string, string>> => {
    log(`creating mark map from [${marksFileName}]`);
    const [beginMarkStr, endMarkStr] = markTagProvider(marksFileName);
    const beginMarkTagger = createStartTag(beginMarkStr);
    const endMarkTagger = createStartTag(endMarkStr); //We want use createStartTag, because endMarkStr must start at the beginning of line
    const getMarkNameFromLine = createGetMarkNameFromLine(beginMarkStr);

    const fileContent = await fileContentProvider(marksFileName);
    const marks = new Map<string, string>();
    return new Promise((resolve, reject) => {
      from(fileContent.split('\n'))
        .pipe(
          filter(
            // select only lines enclosed by beginMarkTag and endMarkTag. Include line with beginMarkTag
            switchTrueFalse(
              s => beginMarkTagger.test(s),
              s => endMarkTagger.test(s)
            )
          ),
          // group the lines by their tags
          splitIf(s => beginMarkTagger.test(s)),
          //create a mark record
          map(lines => ({
            name: getMarkNameFromLine(lines[0]),
            value: lines.slice(1).join('\n'),
          })),
          //do not allow mark record with an empty name
          filter(markRecord => markRecord.name.length > 0),
          //add mark record to a map
          scan((acc, markRecord) => {
            log(`CREATE mark [${marksFileName}][${markRecord.name}]`);
            return acc.set(markRecord.name, markRecord.value);
          }, marks)
        )
        .subscribe({
          error: err => {
            reject(err);
          },
          complete: () => {
            if (marks.size === 0) {
              reject(new Error(`No marks found in [${marksFileName}]`));
            }
            resolve(marks);
          },
        });
    });
  };

  return cacheOneArgFnAsync(_getMapFromFile);
};

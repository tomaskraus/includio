import {logger} from './common';
import {from, filter, scan, map} from 'rxjs';
import {switchTrueFalse} from 'stateful-predicates';
import {splitIf} from 'split-if';
import {cacheOneArgFnAsync} from '../utils/cache_fn';
import {createFirstAndRestMatcher} from '../utils/first_and_rest_matcher';

const log = logger('includo:markMapProvider');

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
    const beginMarkMatcher = createFirstAndRestMatcher(beginMarkStr);
    const endMarkMatcher = createFirstAndRestMatcher(endMarkStr);

    const fileContent = await fileContentProvider(marksFileName);
    const marks = new Map<string, string>();
    return new Promise((resolve, reject) => {
      from(fileContent.split('\n'))
        .pipe(
          filter(
            // select only lines enclosed by beginMarkTag and endMarkTag. Include line with beginMarkTag
            switchTrueFalse(
              s => beginMarkMatcher.test(s),
              s => endMarkMatcher.test(s)
            )
          ),
          // group the lines by their tags
          splitIf(s => beginMarkMatcher.test(s)),
          //create a mark record
          map(lines => ({
            name: beginMarkMatcher.rest(lines[0]),
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

/**
 * MarkMapProvider
 *
 * for a file, extract its marks contents to a map
 */

import {appLog} from './common';
import {from, filter, scan, map} from 'rxjs';
import {switchTrueFalse} from 'stateful-predicates';
import {splitIf} from 'split-if';
import {cacheOneArgFnAsync} from '../utils/cache_fn';
import {createHeadTailMatcher} from '../utils/head_tail_matcher';

const log = appLog.extend('markMapProvider');

export const createMarkMapProvider = (
  fileContentProvider: (filename: string) => Promise<string>,
  markTagProvider: (filename: string) => [string, string],
  markNameRegexp: RegExp
) => {
  log('CREATE markMapProvider');

  const _getMapFromFile = async (
    marksFileName: string
  ): Promise<Map<string, string>> => {
    log(`creating mark map from [${marksFileName}]`);
    const [beginMarkStr, endMarkStr] = markTagProvider(marksFileName);
    const beginMarkMatcher = createHeadTailMatcher(beginMarkStr);
    const endMarkMatcher = createHeadTailMatcher(endMarkStr);

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
          map(lines => {
            const name = beginMarkMatcher.tail(lines[0]);
            if (name.length > 0 && !markNameRegexp.test(name)) {
              throw new Error(`Invalid mark name [${name}]`);
            }
            return {
              name,
              value: lines.slice(1).join('\n'),
            };
          }),
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

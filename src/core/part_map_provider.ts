/**
 * partMapProvider
 *
 * for a file, extract its parts contents to a map
 */

import {appLog} from './common';
import {from, filter, scan, map} from 'rxjs';
import {splitIf} from 'split-if';
import {cacheOneArgFnAsync} from '../utils/cache_fn';
import {createHeadTailMatcher} from '../utils/head_tail_matcher';
import {createWordMatcher} from '../utils/word_matcher';

const log = appLog.extend('partMapProvider');

export const createPartMapProvider = (
  fileContentProvider: (filename: string) => Promise<string[]>,
  partTagProvider: (filename: string) => string,
  partNameRegexp: RegExp
) => {
  log('CREATE partMapProvider');

  const partNameMatcher = createWordMatcher(partNameRegexp);
  const _getMapFromFile = async (
    partsFileName: string
  ): Promise<Map<string, string[]>> => {
    log(`creating part map from [${partsFileName}]`);
    const partTagStr = partTagProvider(partsFileName);
    const partTagMatcher = createHeadTailMatcher(partTagStr);

    const lines = await fileContentProvider(partsFileName);
    const parts = new Map<string, string[]>();
    return new Promise((resolve, reject) => {
      from(lines)
        .pipe(
          // split the lines by their part tags
          splitIf(s => partTagMatcher.test(s)),
          //create a part record
          map(lines => {
            const name = partTagMatcher.tail(lines[0]);
            if (name.length > 0 && !partNameMatcher.test(name)) {
              throw new Error(`Invalid part name: (${name})`);
            }
            return {
              name,
              value: lines.slice(1),
            };
          }),
          //do not allow part record with an empty name
          filter(partRecord => partRecord.name.length > 0),
          //add part record to a map
          scan((acc, partRecord) => {
            log(`CREATE part [${partsFileName}][${partRecord.name}]`);
            return acc.set(partRecord.name, partRecord.value);
          }, parts)
        )
        .subscribe({
          error: err => {
            reject(err);
          },
          complete: () => {
            if (parts.size === 0) {
              reject(new Error(`No parts found in (${partsFileName})`));
            }
            resolve(parts);
          },
        });
    });
  };

  return cacheOneArgFnAsync(_getMapFromFile);
};

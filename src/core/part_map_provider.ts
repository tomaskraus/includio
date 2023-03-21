/**
 * partMapProvider
 *
 * for a file, extract its parts contents to a map
 */

import {appLog, getFileLineInfoStr} from './common';
import {from, filter, scan, map} from 'rxjs';
import {splitIf} from 'split-if';
import {cacheOneArgFnAsync} from '../utils/cache_fn';
import {createFirstMatcher} from '../utils/first_matcher';

const log = appLog.extend('partMapProvider');

export const createPartMapProvider = (
  fileContentProvider: (filename: string) => Promise<string[]>,
  commentTagProvider: (filename: string) => string,
  partNameRegexp: RegExp
  // partChar: string
) => {
  log('CREATE partMapProvider');
  const partChar = '<';

  const partNameMatcher = createFirstMatcher(partNameRegexp);
  const _getMapFromFile = async (
    partsFileName: string
  ): Promise<Map<string, string[]>> => {
    log(`creating part map from [${partsFileName}]`);
    const commentStr = commentTagProvider(partsFileName);
    const markRegex = new RegExp(`^\\s*${commentStr}${partChar}\\s*(.*)$`);

    const lines = await fileContentProvider(partsFileName);
    const parts = new Map<string, string[]>();
    return new Promise((resolve, reject) => {
      from(lines)
        .pipe(
          // preserve line number
          map((s, i) => ({value: s, lineNumber: i + 1})),
          // split the lines by their part tags
          splitIf(s => markRegex.test(s.value)),
          // create a part record
          map(nLines => {
            const startLineNumber = nLines[0].lineNumber;
            const matches: string[] = nLines[0].value.match(markRegex) || [
              '',
              '',
            ];
            const name = matches[1].trim();
            if (name.length > 0 && !partNameMatcher.test(name)) {
              throw new Error(
                `Create part from ("${getFileLineInfoStr(
                  partsFileName,
                  startLineNumber
                )}"): invalid value: (${name})`
              );
            }
            return {
              name: partNameMatcher.head(name),
              value: nLines.slice(1).map(ln => ln.value),
              startLineNumber,
            };
          }),
          //do not allow part record with an empty name
          filter(partRecord => partRecord.name.length > 0),
          //add part record to a map
          scan((acc, partRecord) => {
            log(`CREATE part [${partsFileName}][${partRecord.name}]`);
            if (acc.has(partRecord.name)) {
              throw new Error(
                `Duplicit part name (${
                  partRecord.name
                }) in ("${getFileLineInfoStr(
                  partsFileName,
                  partRecord.startLineNumber
                )}")`
              );
            }
            return acc.set(partRecord.name, partRecord.value);
          }, parts)
        )
        .subscribe({
          error: err => {
            reject(err);
          },
          complete: () => {
            if (parts.size === 0) {
              reject(new Error(`No parts found in ("${partsFileName}")`));
            }
            resolve(parts);
          },
        });
    });
  };

  return cacheOneArgFnAsync(_getMapFromFile);
};

/**
 * partContentProvider
 *
 * for a fileName and partName, returns content of a partName key for that file
 */
import {createWordMatcher} from '../utils/word_matcher';
import {appLog} from './common';

const log = appLog.extend('partContentProvider');

export const createPartContentProvider = (
  partMapProvider: (partsFileName: string) => Promise<Map<string, string[]>>,
  partNameRegexp: RegExp
) => {
  log('CREATE partContentProvider');

  const partNameMatcher = createWordMatcher(partNameRegexp);
  return async (fileName: string, partNameStr: string): Promise<string[]> => {
    if (partNameMatcher.test(partNameStr) === false) {
      return Promise.reject(new Error(`Invalid part name: (${partNameStr})`));
    }
    const parsedPartName = partNameMatcher.value(partNameStr);
    log(`getting part map for file [${fileName}]`);
    const partsMap = await partMapProvider(fileName);
    log(`looking for part [${parsedPartName}]`);
    const resultStr = partsMap.get(parsedPartName);
    if (typeof resultStr === 'undefined') {
      return Promise.reject(
        new Error(`part (${parsedPartName}) not found in (${fileName})`)
      );
    }
    return Promise.resolve(resultStr);
  };
};

/**
 * partContentProvider
 *
 * for a fileName and partName, returns content of a partName key for that file
 */
import {appLog} from './common';

const log = appLog.extend('partContentProvider');

export const createPartContentProvider = (
  partMapProvider: (partsFileName: string) => Promise<Map<string, string[]>>,
  partNameRegexp: RegExp
) => {
  log('CREATE partContentProvider');

  return async (fileName: string, partName: string): Promise<string[]> => {
    if (partNameRegexp.test(partName) === false) {
      return Promise.reject(new Error(`Invalid part name: (${partName})`));
    }
    log(`getting part map for file [${fileName}]`);
    const partsMap = await partMapProvider(fileName);
    log(`looking for part [${partName}]`);
    const resultStr = partsMap.get(partName);
    if (typeof resultStr === 'undefined') {
      return Promise.reject(
        new Error(`part (${partName}) not found in (${fileName})`)
      );
    }
    return Promise.resolve(resultStr);
  };
};

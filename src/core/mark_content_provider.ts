/**
 * MarkContentProvider
 *
 * for a fileName and markName, returns content of a markName key for that file
 */
import {appLog} from './common';

const log = appLog.extend('markContentProvider');

export const createMarkContentProvider = (
  markMapProvider: (marksFileName: string) => Promise<Map<string, string>>,
  markNameRegexp: RegExp
) => {
  log('CREATE markContentProvider');

  return async (fileName: string, markName: string): Promise<string> => {
    if (markNameRegexp.test(markName) === false) {
      return Promise.reject(new Error(`Invalid mark name: [${markName}]`));
    }
    log(`getting marks map for file [${fileName}]`);
    const marksMap = await markMapProvider(fileName);
    log(`looking for mark [${markName}]`);
    const resultStr = marksMap.get(markName);
    if (typeof resultStr === 'undefined') {
      return Promise.reject(
        new Error(`mark [${markName}] not found in [${fileName}]`)
      );
    }
    return Promise.resolve(resultStr);
  };
};

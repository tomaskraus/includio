import {logger} from './common';

const log = logger('includo:markContentProvider');

export const createMarkContentProvider = (
  markMapProvider: (marksFileName: string) => Promise<Map<string, string>>
) => {
  log('CREATE markContentProvider');

  return async (fileName: string, markName: string): Promise<string> => {
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

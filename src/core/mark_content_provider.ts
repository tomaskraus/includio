import {logger} from './common';
import {createMarkMapProvider} from './mark_map_provider';

const log = logger('includo:markContentProvider');

export const createMarkContentProvider = (
  fileContentProvider: (filename: string) => Promise<string>,
  markTagProvider: (filename: string) => [string, string]
) => {
  log('CREATE markContentProvider');

  const markMapProvider = createMarkMapProvider(
    fileContentProvider,
    markTagProvider
  );
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

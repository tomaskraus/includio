import {logger} from './common';

const log = logger('includo:markContentProvider');

export const createMarkContentProvider = (
  fileContentProvider: (filename: string) => Promise<string>
) => {
  //   const startMarkStr = '//<';
  //   const endMarkStr = '//>';

  log('CREATE markContentProvider for fileContentProvider');

  return async (fileName: string, markName: string): Promise<string> => {
    log(`creating marks for [${fileName}]`);
    const fileContent = await fileContentProvider(fileName);

    log(`looking for mark [${markName}]`);
    if (markName === 'mark1') {
      return Promise.resolve(' m1 line1 \nm1 line2');
    }
    return Promise.reject(
      new Error(`mark [${markName}] not found in [${fileName}]`)
    );
  };
};

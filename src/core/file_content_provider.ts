import {readFile} from 'node:fs/promises';
import {join, normalize} from 'node:path';
import {logger} from './common';
import {cacheOneArgFnAsync} from '../utils';

const log = logger('includo:fileContentProvider');

export const createFileContentProvider = (baseDir: string) => {
  log(`CREATE fileContentProvider for baseDir [${baseDir}]`);

  return cacheOneArgFnAsync(async (fileName: string) => {
    const finalFileName = normalize(join(baseDir, fileName));
    log(`loading file [${finalFileName}]`);
    const content = await readFile(finalFileName, {encoding: 'utf-8'});
    return content;
  });
};

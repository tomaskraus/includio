import {readFile} from 'node:fs/promises';
import {join, normalize} from 'node:path';
import {logger} from './common';

const log = logger('fileContentProvider');

export const createFileContentProvider =
  (baseDir: string) => async (fileName: string) => {
    const finalFileName = normalize(join(baseDir, fileName));
    log(`loading file [${finalFileName}]`);
    const content = await readFile(finalFileName, {encoding: 'utf-8'});
    return content;
  };
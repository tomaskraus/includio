import {readFile} from 'node:fs/promises';
import {join, normalize} from 'node:path';

export const createFileContentProvider =
  (baseDir: string) => async (fileName: string) => {
    const finalFileName = normalize(join(baseDir, fileName));
    const content = await readFile(finalFileName, {encoding: 'utf-8'});
    return content;
  };

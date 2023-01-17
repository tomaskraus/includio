import {readFile} from 'node:fs/promises';

export const createFileContentProvider =
  (baseDir: string) => async (fileName: string) => {
    const content = await readFile(fileName, {encoding: 'utf-8'});
    return content;
  };

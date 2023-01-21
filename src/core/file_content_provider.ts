import {readFile} from 'node:fs/promises';
import {logger} from './common';

const log = logger('includo:fileContentProvider');

export const fileContentProvider = async (fileName: string) => {
  log(`LOAD file content [${fileName}]`);
  const content = await readFile(fileName, {encoding: 'utf-8'});
  return content;
};

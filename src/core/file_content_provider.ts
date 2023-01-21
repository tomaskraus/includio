import {readFile} from 'node:fs/promises';
import {logger} from './common';
import {cacheOneArgFnAsync} from '../utils';

const log = logger('includo:fileContentProvider');

export const fileContentProvider = cacheOneArgFnAsync(
  async (fileName: string) => {
    log(`LOAD file content [${fileName}]`);
    const content = await readFile(fileName, {encoding: 'utf-8'});
    return content;
  }
);

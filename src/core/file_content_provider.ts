/**
 * loads a text file
 */

import {readFile} from 'node:fs/promises';
import {appLog} from './common';
import {cacheOneArgFnAsync} from '../utils/cache_fn';

const log = appLog.extend('fileContentProvider');

export const fileContentProvider = cacheOneArgFnAsync(
  async (fileName: string) => {
    log(`LOAD file content [${fileName}]`);
    return readFile(fileName, {encoding: 'utf-8'}).then(lines =>
      lines.split('\n')
    );
  }
);

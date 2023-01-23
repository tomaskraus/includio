import {createIncludoProcessor} from './includo';
import {appLog} from './core/common';

import {stdin, stdout} from 'node:process';

const log = appLog.extend('CLI');

createIncludoProcessor({baseDir: 'assets'})(stdin, stdout)
  .then(result => {
    log(`lines read: ${result.lineNumber}`);
  })
  .catch(err => console.error(err));

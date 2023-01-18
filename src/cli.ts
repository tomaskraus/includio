import {createIncludoProcessor} from './includo';
import {logger} from './core/common';

import {stdin, stdout} from 'node:process';

const log = logger('includo:CLI');

createIncludoProcessor()(stdin, stdout)
  .then(result => {
    log(`lines read: ${result.lineNumber}`);
  })
  .catch(err => console.error(err));

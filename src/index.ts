#!/usr/bin/env/node

import {processRead} from './includo';
import {fileStreamWrapper} from './utils/filestreamwrapper';

import {stdin, stdout} from 'node:process';

const fileOrStreamProcess = fileStreamWrapper(processRead);

fileOrStreamProcess('input.txt', stdout)
  .then(result => {
    console.log(`result: ${result}`);
  })
  .catch(err => console.error(err));

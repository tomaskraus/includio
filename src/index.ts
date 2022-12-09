#!/usr/bin/env/node

import {streamLineTransformer} from './utils/streamlinetransformer';
import {fileStreamWrapper} from './utils/filestreamwrapper';

import {stdin, stdout} from 'node:process';

const fileOrStreamProcess = fileStreamWrapper(
  streamLineTransformer(async (x: string) => x)
);

fileOrStreamProcess('input.txt', stdout)
  .then(result => {
    console.log(`lines read: ${result.linesRead}`);
  })
  .catch(err => console.error('E: ', err));

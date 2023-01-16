#!/usr/bin/env/node

import {createIncludoProcessor, DEFAULT_INCLUDO_OPTIONS} from './includo';

import {stdin, stdout} from 'node:process';

createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS)('input.txt', stdout);
createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS)(stdin, stdout)

  .then(result => {
    console.log(`lines read: ${result.lineNumber}`);
  })
  .catch(err => console.error(err));

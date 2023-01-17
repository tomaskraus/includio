import {createIncludoProcessor} from './includo';

import {stdin, stdout} from 'node:process';

createIncludoProcessor()(stdin, stdout)
  .then(() => {
    //console.log(`\nlines read: ${result.lineNumber}`);
  })
  .catch(err => console.error(err));

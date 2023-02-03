/*
//< txt
    Create includo engine this way:
//<
*/

import {createIncludoProcessor} from '../../core/includo';

//< code
import {stdin, stdout} from 'node:process';

createIncludoProcessor()(stdin, stdout)
  .then(result => {
    console.log(`lines read: ${result.lineNumber}`);
  })
  .catch(err => console.error(err));
//<

//< code
//<

//<
//<

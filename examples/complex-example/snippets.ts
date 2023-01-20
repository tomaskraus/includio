/*
//< txt
    Create includo engine this way:
//>
*/

/*
//< import
import {createIncludoProcessor} from 'includo';
//>
*/

import {createIncludoProcessor} from '../../src/includo';

//< code
import {stdin, stdout} from 'node:process';

createIncludoProcessor()(stdin, stdout)
  .then(result => {
    console.log(`lines read: ${result.lineNumber}`);
  })
  .catch(err => console.error(err));
//>

//< HU
//>

//<
//>

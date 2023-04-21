/*
//< txt
    Create includio engine this way:
//>
*/

/*
//< import
import {createIncludioProcessor} from 'includio';
//>
*/

import {createIncludioProcessor} from './core/includio';

//< code
import {stdin, stdout} from 'node:process';

createIncludioProcessor()
  .lineMachine(stdin, stdout)
  .then(result => {
    console.log(`lines read: ${result.lineNumber}`);
  })
  .catch(err => console.error(err));
//>

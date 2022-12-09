import {processRead} from './includo';

import {stdin, stdout} from 'node:process';

const result = processRead(stdin, stdout);

console.log(result);

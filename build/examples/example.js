"use strict";
/*
//< txt
    Create includo engine this way:
//>
*/
Object.defineProperty(exports, "__esModule", { value: true });
/*
//< import
import {createIncludoProcessor} from 'includo';
//>
*/
const includo_1 = require("./core/includo");
//< code
const node_process_1 = require("node:process");
(0, includo_1.createIncludoProcessor)()(node_process_1.stdin, node_process_1.stdout)
    .then(result => {
    console.log(`lines read: ${result.lineNumber}`);
})
    .catch(err => console.error(err));
//>
//# sourceMappingURL=example.js.map
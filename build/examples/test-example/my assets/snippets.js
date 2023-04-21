"use strict";
/*
//< txt
    Create includio engine this way:
//<
*/
Object.defineProperty(exports, "__esModule", { value: true });
const includio_1 = require("../../../src/core/includio");
//< code
const node_process_1 = require("node:process");
(0, includio_1.createIncludioProcessor)()
    .lineMachine(node_process_1.stdin, node_process_1.stdout)
    .then(result => {
    console.log(`lines read: ${result.lineNumber}`);
})
    .catch(err => console.error(err));
//<
//< code
//<
//<
//<
//# sourceMappingURL=snippets.js.map
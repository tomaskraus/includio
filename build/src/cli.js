"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const includo_1 = require("./includo");
const node_process_1 = require("node:process");
(0, includo_1.createIncludoProcessor)()(node_process_1.stdin, node_process_1.stdout)
    .then(() => {
    //console.log(`\nlines read: ${result.lineNumber}`);
})
    .catch(err => console.error(err));
//# sourceMappingURL=cli.js.map
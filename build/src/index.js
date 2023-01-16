#!/usr/bin/env/node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const includo_1 = require("./includo");
const node_process_1 = require("node:process");
(0, includo_1.createIncludoProcessor)(includo_1.DEFAULT_INCLUDO_OPTIONS)('input.txt', node_process_1.stdout)
    // createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS)(stdin, stdout)
    .then(result => {
    console.log(`lines read: ${result.lineNumber}`);
})
    .catch(err => console.error(err));
//# sourceMappingURL=index.js.map
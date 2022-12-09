#!/usr/bin/env/node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const includo_1 = require("./includo");
const filestreamwrapper_1 = require("./utils/filestreamwrapper");
const node_process_1 = require("node:process");
const fileOrStreamProcess = (0, filestreamwrapper_1.fileStreamWrapper)(includo_1.processRead);
fileOrStreamProcess('input.txt', node_process_1.stdout)
    .then(result => {
    console.log(`result: ${result}`);
})
    .catch(err => console.error(err));
//# sourceMappingURL=index.js.map
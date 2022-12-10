#!/usr/bin/env/node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const streamlinetransformer_1 = require("./utils/streamlinetransformer");
const filestreamwrapper_1 = require("./utils/filestreamwrapper");
const includo_1 = require("./includo");
const node_process_1 = require("node:process");
const fileOrStreamProcess = (0, filestreamwrapper_1.fileStreamWrapper)((0, streamlinetransformer_1.streamLineTransformer)((0, includo_1.createIncludoProcessor)()));
fileOrStreamProcess('input.txt', node_process_1.stdout)
    .then(result => {
    console.log(`lines read: ${result.linesRead}`);
})
    .catch(err => console.error('E: ', err));
//# sourceMappingURL=index.js.map
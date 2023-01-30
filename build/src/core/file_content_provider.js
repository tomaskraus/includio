"use strict";
/**
 * loads a text file
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileContentProvider = void 0;
const promises_1 = require("node:fs/promises");
const common_1 = require("./common");
const cache_fn_1 = require("../utils/cache_fn");
const log = common_1.appLog.extend('fileContentProvider');
exports.fileContentProvider = (0, cache_fn_1.cacheOneArgFnAsync)(async (fileName) => {
    log(`LOAD file content [${fileName}]`);
    return (0, promises_1.readFile)(fileName, { encoding: 'utf-8' }).then(lines => lines.split('\n'));
});
//# sourceMappingURL=file_content_provider.js.map
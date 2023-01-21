"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileContentProvider = void 0;
const promises_1 = require("node:fs/promises");
const common_1 = require("./common");
const utils_1 = require("../utils");
const log = (0, common_1.logger)('includo:fileContentProvider');
exports.fileContentProvider = (0, utils_1.cacheOneArgFnAsync)(async (fileName) => {
    log(`LOAD file content [${fileName}]`);
    const content = await (0, promises_1.readFile)(fileName, { encoding: 'utf-8' });
    return content;
});
//# sourceMappingURL=file_content_provider.js.map
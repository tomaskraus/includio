"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFileContentProvider = void 0;
const promises_1 = require("node:fs/promises");
const createFileContentProvider = (baseDir) => async (fileName) => {
    const content = await (0, promises_1.readFile)(fileName, { encoding: 'utf-8' });
    return content;
};
exports.createFileContentProvider = createFileContentProvider;
//# sourceMappingURL=file_content_provider.js.map
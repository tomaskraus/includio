"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFileContentProvider = void 0;
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
const common_1 = require("./common");
const log = (0, common_1.logger)('includo:fileContentProvider');
const createFileContentProvider = (baseDir) => async (fileName) => {
    const finalFileName = (0, node_path_1.normalize)((0, node_path_1.join)(baseDir, fileName));
    log(`loading file [${finalFileName}]`);
    const content = await (0, promises_1.readFile)(finalFileName, { encoding: 'utf-8' });
    return content;
};
exports.createFileContentProvider = createFileContentProvider;
//# sourceMappingURL=file_content_provider.js.map
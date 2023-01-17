"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInsertionDispatcher = void 0;
const utils_1 = require("../utils");
const file_content_provider_1 = require("./file_content_provider");
// https://stackoverflow.com/questions/6768779/test-filename-with-regular-expression
const _FILEPATH_CHARS_REGEXP = /[^<>;,?"*|]+/;
const _FILEPATH_CHARS_NO_SPACE_REGEXP = /[^<>;,?"*| ]+/;
const ONLY_FILENAME_WITH_NO_SPACES_REGEXP = new RegExp(`^(${_FILEPATH_CHARS_NO_SPACE_REGEXP.source})$`);
const ONLY_QUOTED_FILENAME_REGEXP = new RegExp(`^"(${_FILEPATH_CHARS_REGEXP.source})"$`);
const ONLY_FILENAME_REGEXP = new RegExp(`${ONLY_FILENAME_WITH_NO_SPACES_REGEXP.source}|${ONLY_QUOTED_FILENAME_REGEXP.source}`);
const createInsertionDispatcher = (options) => {
    const fileContentProvider = (0, file_content_provider_1.createFileContentProvider)(options.baseDir);
    return async (tagContent) => {
        if (tagContent.length === 0) {
            return Promise.reject(new Error('empty tag not allowed!'));
        }
        if (ONLY_FILENAME_REGEXP.test(tagContent)) {
            const matches = (0, utils_1.defaultValue)([''])(tagContent.match(ONLY_FILENAME_REGEXP));
            const fileName = matches[1] || matches[2]; //either with or without double quotes
            return fileContentProvider(fileName);
        }
        return Promise.reject(new Error('Invalid tag content!'));
    };
};
exports.createInsertionDispatcher = createInsertionDispatcher;
//# sourceMappingURL=insertion_dispatcher.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInsertionDispatcher = void 0;
const utils_1 = require("../utils");
const file_content_provider_1 = require("./file_content_provider");
const mark_content_provider_1 = require("./mark_content_provider");
// https://stackoverflow.com/questions/6768779/test-filename-with-regular-expression
const _FILEPATH_CHARS_REGEXP = /[^<>;,?"*|]+/;
const _FILEPATH_CHARS_NO_SPACE_REGEXP = /[^<>;,?"*| ]+/;
const ONLY_FILENAME_WITH_NO_SPACES_REGEXP = new RegExp(`^(${_FILEPATH_CHARS_NO_SPACE_REGEXP.source})$`);
const ONLY_QUOTED_FILENAME_REGEXP = new RegExp(`^"(${_FILEPATH_CHARS_REGEXP.source})"$`);
const ONLY_FILENAME_REGEXP = new RegExp(`${ONLY_FILENAME_WITH_NO_SPACES_REGEXP.source}|${ONLY_QUOTED_FILENAME_REGEXP.source}`);
const _MARK_NAME_REGEXP = /[a-zA-z]+[\w\d-]*/;
const FILENAME_AND_MARK_REGEXP = new RegExp(`^(${_FILEPATH_CHARS_NO_SPACE_REGEXP.source})\\s+(${_MARK_NAME_REGEXP.source})$|^"(${_FILEPATH_CHARS_REGEXP.source})"\\s+(${_MARK_NAME_REGEXP.source})$`);
const createInsertionDispatcher = (options) => {
    const fileContentProvider = (0, file_content_provider_1.createFileContentProvider)(options.baseDir);
    const markContentProvider = (0, mark_content_provider_1.createMarkContentProvider)(fileContentProvider, '//<', '//>');
    return async (tagContent) => {
        if (tagContent.length === 0) {
            return Promise.reject(new Error('empty tag not allowed!'));
        }
        if (ONLY_FILENAME_REGEXP.test(tagContent)) {
            const matches = (0, utils_1.defaultValue)([''])(tagContent.match(ONLY_FILENAME_REGEXP));
            const fileName = matches[1] || matches[2]; //either with or without double quotes
            return fileContentProvider(fileName);
        }
        if (FILENAME_AND_MARK_REGEXP.test(tagContent)) {
            const matches = (0, utils_1.defaultValue)([''])(tagContent.match(FILENAME_AND_MARK_REGEXP));
            const fileName = matches[1] || matches[3]; //either with or without double quotes
            const markName = matches[2] || matches[4];
            return markContentProvider(fileName, markName);
        }
        return Promise.reject(new Error('Invalid tag content!'));
    };
};
exports.createInsertionDispatcher = createInsertionDispatcher;
//# sourceMappingURL=insertion_dispatcher.js.map
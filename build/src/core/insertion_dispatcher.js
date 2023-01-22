"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInsertionDispatcher = void 0;
const default_value_1 = require("../utils/default_value");
const common_1 = require("./common");
const file_content_provider_1 = require("./file_content_provider");
const mark_map_provider_1 = require("./mark_map_provider");
const mark_content_provider_1 = require("./mark_content_provider");
const mark_tag_provider_1 = require("./mark_tag_provider");
const log = (0, common_1.logger)('includo:insertionDispatcher');
// https://stackoverflow.com/questions/6768779/test-filename-with-regular-expression
const _FILEPATH_CHARS_REGEXP = /[^<>;,?"*|]+/;
const _FILEPATH_CHARS_NO_SPACE_REGEXP = /[^<>;,?"*| ]+/;
const ONLY_FILENAME_REGEXP = new RegExp(`^(${_FILEPATH_CHARS_NO_SPACE_REGEXP.source})$|^"(${_FILEPATH_CHARS_REGEXP.source})"$`);
const FILENAME_AND_MARK_REGEXP = new RegExp(`^(${_FILEPATH_CHARS_NO_SPACE_REGEXP.source})\\s+(${common_1.MARK_NAME_REGEXP.source})$|^"(${_FILEPATH_CHARS_REGEXP.source})"\\s+(${common_1.MARK_NAME_REGEXP.source})$`);
const createInsertionDispatcher = (options) => {
    const markTagProvider = (0, mark_tag_provider_1.createMarkTagProvider)(options);
    const markMapProvider = (0, mark_map_provider_1.createMarkMapProvider)(file_content_provider_1.fileContentProvider, markTagProvider);
    const markContentProvider = (0, mark_content_provider_1.createMarkContentProvider)(markMapProvider);
    const fileNameResolver = (0, common_1.createFileNameResolver)(options.baseDir);
    log(`CREATE insertionDispatcher. BaseDir: [${options.baseDir}]`);
    return async (tagContent) => {
        log(`call on [${tagContent}]`);
        if (tagContent.length === 0) {
            return Promise.reject(new Error('empty tag not allowed!'));
        }
        if (ONLY_FILENAME_REGEXP.test(tagContent)) {
            const matches = (0, default_value_1.defaultIfNullOrUndefined)([''])(tagContent.match(ONLY_FILENAME_REGEXP));
            const fileName = fileNameResolver(matches[1] || matches[2]); //either with or without double quotes
            return (0, file_content_provider_1.fileContentProvider)(fileName);
        }
        if (FILENAME_AND_MARK_REGEXP.test(tagContent)) {
            const matches = (0, default_value_1.defaultIfNullOrUndefined)([''])(tagContent.match(FILENAME_AND_MARK_REGEXP));
            const fileName = fileNameResolver(matches[1] || matches[3]); //either with or without double quotes
            const markName = matches[2] || matches[4];
            return markContentProvider(fileName, markName);
        }
        return Promise.reject(new Error(`Invalid tag content: [${tagContent}]`));
    };
};
exports.createInsertionDispatcher = createInsertionDispatcher;
//# sourceMappingURL=insertion_dispatcher.js.map
"use strict";
/**
 * InsertionDispatcher
 *
 * gets an input line,
 * returns a string content that depends on a command on that input line
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInsertionDispatcher = void 0;
const common_1 = require("./common");
const file_content_provider_1 = require("./file_content_provider");
const mark_map_provider_1 = require("./mark_map_provider");
const mark_content_provider_1 = require("./mark_content_provider");
const mark_tag_provider_1 = require("./mark_tag_provider");
const first_and_rest_matcher_1 = require("../utils/first_and_rest_matcher");
const log = common_1.appLog.extend('insertionDispatcher');
const createInsertionDispatcher = (options) => {
    // https://stackoverflow.com/questions/6768779/test-filename-with-regular-expression
    const FILEPATH_REGEXP = /[^<>;,?"*| ]+/;
    const FILEPATH_QUOTED_REGEXP = /"[^<>;,?"*|]+"/;
    const fileNameMatcher = (0, first_and_rest_matcher_1.createFirstAndRestMatcher)(FILEPATH_REGEXP);
    const fileNameQuotedMatcher = (0, first_and_rest_matcher_1.createFirstAndRestMatcher)(FILEPATH_QUOTED_REGEXP);
    const commandDispatcher = createCommandDispatcher(options);
    log(`CREATE insertionDispatcher. BaseDir: [${options.baseDir}]`);
    return async (tagContent) => {
        log(`call on [${tagContent}]`);
        if (tagContent.length === 0) {
            return Promise.reject(new Error('empty tag not allowed!'));
        }
        if (fileNameMatcher.test(tagContent)) {
            return commandDispatcher(fileNameMatcher.first(tagContent), fileNameMatcher.rest(tagContent));
        }
        if (fileNameQuotedMatcher.test(tagContent)) {
            //remove quotes
            const fileNameWithoutQuotes = fileNameQuotedMatcher
                .first(tagContent)
                .slice(1, -1);
            return commandDispatcher(fileNameWithoutQuotes, fileNameQuotedMatcher.rest(tagContent));
        }
        return Promise.reject(new Error(`Invalid tag content: [${tagContent}]`));
    };
};
exports.createInsertionDispatcher = createInsertionDispatcher;
const createCommandDispatcher = (options) => {
    const markMapProvider = (0, mark_map_provider_1.createMarkMapProvider)(file_content_provider_1.fileContentProvider, (0, mark_tag_provider_1.createMarkTagProvider)(options), common_1.MARK_NAME_REGEXP);
    const markContentProvider = (0, mark_content_provider_1.createMarkContentProvider)(markMapProvider, common_1.MARK_NAME_REGEXP);
    const fileNameResolver = (0, common_1.createFileNameResolver)(options.baseDir);
    const markCmdMatcher = (0, first_and_rest_matcher_1.createFirstAndRestMatcher)(/mark:/);
    return (fileName, restOfLine) => {
        const resolvedFileName = fileNameResolver(fileName);
        if (restOfLine === '') {
            return (0, file_content_provider_1.fileContentProvider)(resolvedFileName);
        }
        if (markCmdMatcher.test(restOfLine)) {
            return markContentProvider(resolvedFileName, markCmdMatcher.rest(restOfLine));
        }
        return Promise.reject(new Error(`Unknown command name: [${restOfLine}]`));
    };
};
//# sourceMappingURL=insertion_dispatcher.js.map
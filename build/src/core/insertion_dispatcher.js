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
const part_map_provider_1 = require("./part_map_provider");
const part_content_provider_1 = require("./part_content_provider");
const part_tag_provider_1 = require("./part_tag_provider");
const head_tail_matcher_1 = require("../utils/head_tail_matcher");
const log = common_1.appLog.extend('insertionDispatcher');
const createInsertionDispatcher = (options) => {
    // https://stackoverflow.com/questions/6768779/test-filename-with-regular-expression
    const FILEPATH_REGEXP = /[^<>;,?"*| ]+/;
    const FILEPATH_QUOTED_REGEXP = /"[^<>;,?"*|]+"/;
    const fileNameMatcher = (0, head_tail_matcher_1.createHeadTailMatcher)(FILEPATH_REGEXP);
    const fileNameQuotedMatcher = (0, head_tail_matcher_1.createHeadTailMatcher)(FILEPATH_QUOTED_REGEXP);
    const commandDispatcher = createCommandDispatcher(options);
    log(`CREATE insertionDispatcher. BaseDir: [${options.sourceDir}]`);
    return async (tagContent) => {
        log(`call on [${tagContent}]`);
        if (tagContent.length === 0) {
            return Promise.reject(new Error('empty tag not allowed!'));
        }
        if (fileNameMatcher.test(tagContent)) {
            return commandDispatcher(fileNameMatcher.head(tagContent), fileNameMatcher.tail(tagContent));
        }
        if (fileNameQuotedMatcher.test(tagContent)) {
            //remove quotes
            const fileNameWithoutQuotes = fileNameQuotedMatcher
                .head(tagContent)
                .slice(1, -1);
            return commandDispatcher(fileNameWithoutQuotes, fileNameQuotedMatcher.tail(tagContent));
        }
        return Promise.reject(new Error(`Invalid tag content: [${tagContent}]`));
    };
};
exports.createInsertionDispatcher = createInsertionDispatcher;
const createCommandDispatcher = (options) => {
    const partMapProvider = (0, part_map_provider_1.createPartMapProvider)(file_content_provider_1.fileContentProvider, (0, part_tag_provider_1.createPartTagProvider)(options), common_1.MARK_NAME_REGEXP);
    const partContentProvider = (0, part_content_provider_1.createPartContentProvider)(partMapProvider, common_1.MARK_NAME_REGEXP);
    const fileNameResolver = (0, common_1.createFileNameResolver)(options.sourceDir);
    const partCmdMatcher = (0, head_tail_matcher_1.createHeadTailMatcher)(/part:/);
    return (fileName, restOfLine) => {
        const resolvedFileName = fileNameResolver(fileName);
        if (restOfLine === '') {
            return (0, file_content_provider_1.fileContentProvider)(resolvedFileName);
        }
        if (partCmdMatcher.test(restOfLine)) {
            return partContentProvider(resolvedFileName, partCmdMatcher.tail(restOfLine));
        }
        return Promise.reject(new Error(`Unknown command name: [${restOfLine}]`));
    };
};
//# sourceMappingURL=insertion_dispatcher.js.map
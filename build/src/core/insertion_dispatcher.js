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
    log(`CREATE insertionDispatcher. BaseDir: [${options.resourceDir}]`);
    const getLines = createGetLines(options);
    return async (tagContent) => {
        log(`call on [${tagContent}]`);
        if (tagContent.length === 0) {
            return Promise.reject(new Error('empty tag not allowed!'));
        }
        const lines = await getLines(tagContent);
        return lines.join('\n');
    };
};
exports.createInsertionDispatcher = createInsertionDispatcher;
const createParseFileName = () => {
    // https://stackoverflow.com/questions/6768779/test-filename-with-regular-expression
    const FILEPATH_REGEXP = /[^<>;,?"*| ]+/;
    const FILEPATH_QUOTED_REGEXP = /"[^<>;,?"*|]+"/;
    const fileNameMatcher = (0, head_tail_matcher_1.createHeadTailMatcher)(FILEPATH_REGEXP);
    const fileNameQuotedMatcher = (0, head_tail_matcher_1.createHeadTailMatcher)(FILEPATH_QUOTED_REGEXP);
    return (line) => {
        if (fileNameMatcher.test(line) && fileNameMatcher.tail(line) === '') {
            return fileNameMatcher.head(line);
        }
        if (fileNameQuotedMatcher.test(line) &&
            fileNameQuotedMatcher.tail(line) === '') {
            //remove quotes
            return fileNameQuotedMatcher.head(line).slice(1, -1);
        }
        throw new Error(`Invalid file name format: [${line}]
    File name contains spaces. Enclose such a file name in quotes.`);
    };
};
const createGetLines = (options) => {
    const partMapProvider = (0, part_map_provider_1.createPartMapProvider)(file_content_provider_1.fileContentProvider, (0, part_tag_provider_1.createPartTagProvider)(options), common_1.MARK_NAME_REGEXP);
    const partContentProvider = (0, part_content_provider_1.createPartContentProvider)(partMapProvider, common_1.MARK_NAME_REGEXP);
    const fileNameResolver = (0, common_1.createFileNameResolver)(options.resourceDir);
    const parseFileName = createParseFileName();
    return async (tagContent) => {
        const tokens = tagContent.split('part:');
        const fileName = fileNameResolver(parseFileName(tokens[0]));
        if (tokens.length === 1) {
            return (0, file_content_provider_1.fileContentProvider)(fileName);
        }
        if (tokens.length === 2) {
            return partContentProvider(fileName, tokens[1].trim());
        }
        throw new Error(`Invalid format: [${tagContent}]`);
    };
};
//# sourceMappingURL=insertion_dispatcher.js.map
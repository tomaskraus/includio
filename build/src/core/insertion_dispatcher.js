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
const comment_tag_provider_1 = require("./comment_tag_provider");
const line_dispatcher_1 = require("./line_dispatcher");
const separator_matcher_1 = require("../utils/separator_matcher");
const first_matcher_1 = require("../utils/first_matcher");
const log = common_1.appLog.extend('insertionDispatcher');
const createInsertionDispatcher = (options) => {
    log(`CREATE insertionDispatcher. resourceDir: [${options.resourceDir}]`);
    const getLines = createGetLines(options, common_1.PART_NAME_REGEXP);
    const lineDispatcher = (0, line_dispatcher_1.createLineDispatcher)(common_1.COMMAND_NAME_REGEXP);
    const pipeSeparatorMatcher = (0, separator_matcher_1.createSeparatorMatcher)('\\|');
    return async (tagContent) => {
        log(`call on [${tagContent}]`);
        if (tagContent.trim().length === 0) {
            return Promise.reject(new Error('empty tag not allowed!'));
        }
        const [contentSelector, commands] = pipeSeparatorMatcher.headTail(tagContent);
        const input = await getLines(contentSelector);
        const result = lineDispatcher(input, commands);
        return result.join('\n');
    };
};
exports.createInsertionDispatcher = createInsertionDispatcher;
//---------------------------------------------------------------------------------------
const createGetLines = (options, partNameRegexp) => {
    const partMapProvider = (0, part_map_provider_1.createPartMapProvider)(file_content_provider_1.fileContentProvider, (0, comment_tag_provider_1.createCommentTagProvider)(options), partNameRegexp);
    const partContentProvider = (0, part_content_provider_1.createPartContentProvider)(partMapProvider, partNameRegexp);
    const fileNameResolver = (0, common_1.createFileNameResolver)(options.resourceDir);
    /**
     * contentSelector consists of:
     *   fileName : part
     */
    return async (contentSelector) => {
        const tokens = contentSelector.split(':');
        const fileName = fileNameResolver((0, common_1.parseFileName)(tokens[0]));
        if (tokens.length === 1) {
            return (0, file_content_provider_1.fileContentProvider)(fileName);
        }
        if (tokens.length === 2) {
            const partNameMatcher = (0, first_matcher_1.createFirstMatcher)(partNameRegexp);
            if (!partNameMatcher.test(tokens[1])) {
                throw new Error(`Part: invalid value: (${tokens[1]})`);
            }
            const partName = partNameMatcher.head(tokens[1]);
            return partContentProvider(fileName, partName);
        }
        throw new Error(`Only one part allowed: (${contentSelector})`);
    };
};
//# sourceMappingURL=insertion_dispatcher.js.map
"use strict";
/**
 * DirectiveHandler
 *
 * Gets an input line,
 *   returns a string content that depends on a directive on that input line.
 *
 * Directive's BNF:
 *   <directive> ::= "@@" <selector> | "@@" <selector> "|" <commands>
 *   <selector> ::= <file-name> | <file-name> ":" <part-name>
 *   <commands> ::= <command> | <commands> "|" <command>
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDirectiveHandler = void 0;
const common_1 = require("./common");
const file_content_provider_1 = require("./file_content_provider");
const part_map_provider_1 = require("./part_map_provider");
const part_content_provider_1 = require("./part_content_provider");
const comment_manager_1 = require("./comment_manager");
const command_processor_1 = require("./command_processor");
const separator_matcher_1 = require("../utils/separator_matcher");
const first_matcher_1 = require("../utils/first_matcher");
const log = common_1.appLog.extend('directiveHandler');
const createDirectiveHandler = (options) => {
    log(`CREATE directiveHandler. resourceDir: [${options.resourceDir}]`);
    const getContent = createGetContent(options, common_1.PART_NAME_REGEXP);
    const commandProcessor = (0, command_processor_1.createCommandProcessor)(common_1.COMMAND_NAME_REGEXP);
    const directiveMatcher = (0, first_matcher_1.createFirstMatcher)(options.directiveMark);
    const pipeSeparatorMatcher = (0, separator_matcher_1.createSeparatorMatcher)('\\|');
    return async (directiveLine) => {
        log(`call on [${directiveLine}]`);
        const directiveContent = directiveMatcher.tail(directiveLine);
        if (directiveContent.trim().length === 0) {
            return Promise.reject(new Error('empty directive not allowed!'));
        }
        const indentStr = (0, common_1.getIndentStr)(directiveLine);
        const [contentSelector, commands] = pipeSeparatorMatcher.headTail(directiveContent);
        const inputLines = await getContent(contentSelector);
        const result = commandProcessor(inputLines, commands);
        return result.map(s => indentStr + s).join('\n');
    };
};
exports.createDirectiveHandler = createDirectiveHandler;
//---------------------------------------------------------------------------------------
const createGetContent = (options, partNameRegexp) => {
    const commentManager = (0, comment_manager_1.createCommentManager)(options);
    const partMapProvider = (0, part_map_provider_1.createPartMapProvider)(file_content_provider_1.fileContentProvider, commentManager.startTag, commentManager.endTag, partNameRegexp);
    const partContentProvider = (0, part_content_provider_1.createPartContentProvider)(partMapProvider, partNameRegexp);
    const fileNameResolver = (0, common_1.createFileNameResolver)(options.resourceDir);
    /**
     * contentSelector (a.k.a selector):
     *   BNF: <selector> ::= <file-name> | <file-name> ":" <part-name>
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
//# sourceMappingURL=directive_handler.js.map
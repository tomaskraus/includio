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
const commands_1 = require("./commands");
const log = common_1.appLog.extend('insertionDispatcher');
const createInsertionDispatcher = (options) => {
    log(`CREATE insertionDispatcher. resourceDir: [${options.resourceDir}]`);
    const getLines = createGetLines(options);
    const pipeDispatcher = createPipeDispatcher(common_1.COMMAND_NAME_REGEXP);
    return async (tagContent) => {
        log(`call on [${tagContent}]`);
        if (tagContent.length === 0) {
            return Promise.reject(new Error('empty tag not allowed!'));
        }
        const [contentSelectorStr, ...commandLines] = tagContent.split('|');
        const sourceLines = await getLines(contentSelectorStr);
        const result = pipeDispatcher(commandLines, sourceLines);
        return result.join('\n');
    };
};
exports.createInsertionDispatcher = createInsertionDispatcher;
//---------------------------------------------------------------------------------------
const createGetLines = (options) => {
    const partMapProvider = (0, part_map_provider_1.createPartMapProvider)(file_content_provider_1.fileContentProvider, (0, part_tag_provider_1.createPartTagProvider)(options), common_1.PART_NAME_REGEXP);
    const partContentProvider = (0, part_content_provider_1.createPartContentProvider)(partMapProvider, common_1.PART_NAME_REGEXP);
    const fileNameResolver = (0, common_1.createFileNameResolver)(options.resourceDir);
    return async (tagContent) => {
        const tokens = tagContent.split(':');
        const fileName = fileNameResolver((0, common_1.parseFileName)(tokens[0]));
        if (tokens.length === 1) {
            return (0, file_content_provider_1.fileContentProvider)(fileName);
        }
        if (tokens.length === 2) {
            return partContentProvider(fileName, tokens[1].trim());
        }
        throw new Error(`Only one part allowed: [${tagContent}]`);
    };
};
const createPipeDispatcher = (cmdNameRegexp) => {
    const cmdNameMatcher = (0, head_tail_matcher_1.createHeadTailMatcher)(cmdNameRegexp);
    const pipeDispatcher = (cmdLines, previousResult) => {
        if (cmdLines.length === 0) {
            return previousResult;
        }
        else {
            const [currentCmdLine, ...tail] = cmdLines;
            const sanitizedCurrentCmdLine = currentCmdLine.trim();
            if (sanitizedCurrentCmdLine === '') {
                throw new Error('Empty command in pipe');
            }
            if (cmdNameMatcher.test(sanitizedCurrentCmdLine)) {
                const cmdName = cmdNameMatcher.head(sanitizedCurrentCmdLine);
                const cmdArgs = cmdNameMatcher.tail(sanitizedCurrentCmdLine).split(',');
                const currentResult = commandDispatcher(cmdName, cmdArgs, previousResult);
                return pipeDispatcher(tail, currentResult);
            }
            throw new Error(`Invalid command name: [${sanitizedCurrentCmdLine}]`);
        }
    };
    return pipeDispatcher;
};
const commandDispatcher = (commandName, commandArguments, input) => {
    if (commandName === 'first') {
        return (0, commands_1.cmdFirst)(input, commandArguments);
    }
    throw new Error(`Unknown command: [${commandName}]`);
};
//# sourceMappingURL=insertion_dispatcher.js.map
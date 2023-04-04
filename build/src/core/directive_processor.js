"use strict";
/**
 * processes insertion tag content
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDirectiveProcessor = void 0;
const common_1 = require("./common");
const first_matcher_1 = require("../utils/first_matcher");
const commands_1 = require("./commands");
const separator_matcher_1 = require("../utils/separator_matcher");
const log = common_1.appLog.extend('lineDispatcher');
const createDirectiveProcessor = (cmdNameRegexp) => {
    log('CREATE lineDispatcher');
    const pipeSeparatorMatcher = (0, separator_matcher_1.createSeparatorMatcher)('\\|');
    const cmdNameMatcher = (0, first_matcher_1.createFirstMatcher)(cmdNameRegexp);
    const lineDispatcher = (previousResult, commands) => {
        log(`commands: [${commands}]`);
        if (commands.trim() === '') {
            return previousResult;
        }
        else {
            const [currentCmd, tail] = pipeSeparatorMatcher.headTail(commands);
            if (currentCmd === '') {
                throw new Error('Empty command in pipe');
            }
            if (cmdNameMatcher.test(currentCmd)) {
                const cmdName = cmdNameMatcher.head(currentCmd);
                const cmdArgs = cmdNameMatcher
                    .tail(currentCmd)
                    .split(',')
                    .map(s => s.trim());
                const currentResult = commandDispatcher(previousResult, cmdName, cmdArgs);
                return lineDispatcher(currentResult, tail);
            }
            throw new Error(`Invalid command name: (${currentCmd})`);
        }
    };
    return lineDispatcher;
};
exports.createDirectiveProcessor = createDirectiveProcessor;
const commandDispatcher = (input, commandName, commandArguments) => {
    log(`processing command [${commandName}] with arguments [${commandArguments}]`);
    if (commandName === 'first') {
        return (0, commands_1.cmdFirst)(input, ...commandArguments);
    }
    if (commandName === 'last') {
        return (0, commands_1.cmdLast)(input, ...commandArguments);
    }
    throw new Error(`Unknown command: (${commandName})`);
};
//# sourceMappingURL=directive_processor.js.map
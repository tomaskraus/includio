"use strict";
/**
 * processes insertion tag content
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLineDispatcher = void 0;
const common_1 = require("./common");
const first_matcher_1 = require("../utils/first_matcher");
const commands_1 = require("./commands");
const head_tail_matcher_1 = require("../utils/head_tail_matcher");
const log = common_1.appLog.extend('lineDispatcher');
const createLineDispatcher = (cmdNameRegexp) => {
    log('CREATE lineDispatcher');
    const pipeMatcher = (0, head_tail_matcher_1.createHeadTailMatcher)('\\|');
    const cmdNameMatcher = (0, first_matcher_1.createFirstMatcher)(cmdNameRegexp);
    const lineDispatcher = (previousResult, commands) => {
        log(`commands: [${commands}]`);
        if (commands.trim() === '') {
            return previousResult;
        }
        else {
            const [currentCmd, tail] = pipeMatcher.headTail(commands);
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
exports.createLineDispatcher = createLineDispatcher;
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
//# sourceMappingURL=line_dispatcher.js.map
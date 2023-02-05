/**
 * processes insertion tag content
 */

import {appLog} from './common';

import {createFirstRestMatcher} from '../utils/first_rest_matcher';
import {cmdFirst, cmdLast} from './commands';
import {createHeadTailMatcher} from '../utils/head_tail_matcher';

const log = appLog.extend('lineDispatcher');

export const createLineDispatcher = (cmdNameRegexp: RegExp) => {
  log('CREATE lineDispatcher');

  const pipeMatcher = createHeadTailMatcher('\\|');
  const cmdNameMatcher = createFirstRestMatcher(cmdNameRegexp);

  const lineDispatcher = (
    previousResult: string[],
    commands: string
  ): string[] => {
    log(`commands: [${commands}]`);
    if (commands.trim() === '') {
      return previousResult;
    } else {
      const [currentCmd, tail] = pipeMatcher.headTail(commands);
      if (currentCmd === '') {
        throw new Error('Empty command in pipe');
      }
      if (cmdNameMatcher.test(currentCmd)) {
        const cmdName = cmdNameMatcher.first(currentCmd);
        const cmdArgs = cmdNameMatcher
          .rest(currentCmd)
          .split(',')
          .map(s => s.trim());
        const currentResult = commandDispatcher(
          previousResult,
          cmdName,
          cmdArgs
        );
        return lineDispatcher(currentResult, tail);
      }
      throw new Error(`Invalid command name: (${currentCmd})`);
    }
  };

  return lineDispatcher;
};

const commandDispatcher = (
  input: string[],
  commandName: string,
  commandArguments: string[]
): string[] => {
  log(
    `processing command [${commandName}] with arguments [${commandArguments}]`
  );
  if (commandName === 'first') {
    return cmdFirst(input, ...commandArguments);
  }
  if (commandName === 'last') {
    return cmdLast(input, ...commandArguments);
  }

  throw new Error(`Unknown command: (${commandName})`);
};

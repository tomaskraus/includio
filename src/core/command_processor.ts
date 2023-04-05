/**
 * Processes a resource content through the command pipe.
 */

import {appLog} from './common';

import {createFirstMatcher} from '../utils/first_matcher';
import {cmdFirst, cmdLast} from './commands';
import {createSeparatorMatcher} from '../utils/separator_matcher';

const log = appLog.extend('commandProcessor');

export const createCommandProcessor = (cmdNameRegexp: RegExp) => {
  log('CREATE commandProcessor');

  const pipeSeparatorMatcher = createSeparatorMatcher('\\|');
  const cmdNameMatcher = createFirstMatcher(cmdNameRegexp);

  const commandProcessor = (
    previousResult: string[],
    commands: string
  ): string[] => {
    log(`commands: [${commands}]`);
    if (commands.trim() === '') {
      return previousResult;
    } else {
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
        const currentResult = commandDispatcher(
          previousResult,
          cmdName,
          cmdArgs
        );
        return commandProcessor(currentResult, tail);
      }
      throw new Error(`Invalid command name: (${currentCmd})`);
    }
  };

  return commandProcessor;
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

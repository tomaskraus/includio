/**
 * InsertionDispatcher
 *
 * gets an input line,
 * returns a string content that depends on a command on that input line
 */

import {
  appLog,
  PART_NAME_REGEXP,
  COMMAND_NAME_REGEXP,
  TIncludoOptions,
  createFileNameResolver,
  parseFileName,
} from './common';
import {fileContentProvider} from './file_content_provider';
import {createPartMapProvider} from './part_map_provider';
import {createPartContentProvider} from './part_content_provider';
import {createPartTagProvider} from './part_tag_provider';
import {createLineDispatcher} from './line_dispatcher';
import {createHeadTailMatcher} from '../utils/head_tail_matcher';
import {cmdFirst, cmdLast} from './commands';

const log = appLog.extend('insertionDispatcher');

export const createInsertionDispatcher = (options: TIncludoOptions) => {
  log(`CREATE insertionDispatcher. resourceDir: [${options.resourceDir}]`);

  const getLines = createGetLines(options, PART_NAME_REGEXP);
  const lineDispatcher = createLineDispatcher();

  return async (tagContent: string): Promise<string> => {
    log(`call on [${tagContent}]`);
    if (tagContent.length === 0) {
      return Promise.reject(new Error('empty tag not allowed!'));
    }

    const result = lineDispatcher(tagContent);
    return result.join('\n');
  };
};

//---------------------------------------------------------------------------------------

const createGetLines = (options: TIncludoOptions, partNameRegexp: RegExp) => {
  const partMapProvider = createPartMapProvider(
    fileContentProvider,
    createPartTagProvider(options),
    partNameRegexp
  );
  const partContentProvider = createPartContentProvider(
    partMapProvider,
    partNameRegexp
  );
  const fileNameResolver = createFileNameResolver(options.resourceDir);

  /**
   * contentSelector consists of:
   *   fileName : part
   */
  return async (contentSelector: string): Promise<string[]> => {
    const tokens = contentSelector.split(':');
    const fileName = fileNameResolver(parseFileName(tokens[0]));

    if (tokens.length === 1) {
      return fileContentProvider(fileName);
    }
    if (tokens.length === 2) {
      return partContentProvider(fileName, tokens[1]);
    }
    throw new Error(`Only one part allowed: (${contentSelector})`);
  };
};

const createPipeDispatcher = (cmdNameRegexp: RegExp) => {
  const cmdNameMatcher = createHeadTailMatcher(cmdNameRegexp);

  const pipeDispatcher = (
    cmdLines: string[],
    previousResult: string[]
  ): string[] => {
    if (cmdLines.length === 0) {
      return previousResult;
    } else {
      const [currentCmdLine, ...tail] = cmdLines;
      const sanitizedCurrentCmdLine = currentCmdLine.trim();
      if (sanitizedCurrentCmdLine === '') {
        throw new Error('Empty command in pipe');
      }
      if (cmdNameMatcher.test(sanitizedCurrentCmdLine)) {
        const cmdName = cmdNameMatcher.head(sanitizedCurrentCmdLine);
        const cmdArgs = cmdNameMatcher
          .tail(sanitizedCurrentCmdLine)
          .split(',')
          .map(s => s.trim());
        const currentResult = commandDispatcher(
          cmdName,
          cmdArgs,
          previousResult
        );
        return pipeDispatcher(tail, currentResult);
      }
      throw new Error(`Invalid command name: (${sanitizedCurrentCmdLine})`);
    }
  };

  return pipeDispatcher;
};

const commandDispatcher = (
  commandName: string,
  commandArguments: string[],
  input: string[]
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

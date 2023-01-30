/**
 * InsertionDispatcher
 *
 * gets an input line,
 * returns a string content that depends on a command on that input line
 */

import {
  appLog,
  MARK_NAME_REGEXP,
  TIncludoOptions,
  createFileNameResolver,
} from './common';
import {fileContentProvider} from './file_content_provider';
import {createPartMapProvider} from './part_map_provider';
import {createPartContentProvider} from './part_content_provider';
import {createPartTagProvider} from './part_tag_provider';
import {createHeadTailMatcher} from '../utils/head_tail_matcher';

const log = appLog.extend('insertionDispatcher');

export const createInsertionDispatcher = (options: TIncludoOptions) => {
  // https://stackoverflow.com/questions/6768779/test-filename-with-regular-expression
  const FILEPATH_REGEXP = /[^<>;,?"*| ]+/;
  const FILEPATH_QUOTED_REGEXP = /"[^<>;,?"*|]+"/;
  const fileNameMatcher = createHeadTailMatcher(FILEPATH_REGEXP);
  const fileNameQuotedMatcher = createHeadTailMatcher(FILEPATH_QUOTED_REGEXP);
  const commandDispatcher = createCommandDispatcher(options);

  log(`CREATE insertionDispatcher. BaseDir: [${options.resourceDir}]`);
  return async (tagContent: string): Promise<string> => {
    log(`call on [${tagContent}]`);
    if (tagContent.length === 0) {
      return Promise.reject(new Error('empty tag not allowed!'));
    }

    if (fileNameMatcher.test(tagContent)) {
      return commandDispatcher(
        fileNameMatcher.head(tagContent),
        fileNameMatcher.tail(tagContent)
      ).then(lines => lines.join('\n'));
    }
    if (fileNameQuotedMatcher.test(tagContent)) {
      //remove quotes
      const fileNameWithoutQuotes = fileNameQuotedMatcher
        .head(tagContent)
        .slice(1, -1);
      return commandDispatcher(
        fileNameWithoutQuotes,
        fileNameQuotedMatcher.tail(tagContent)
      ).then(lines => lines.join('\n'));
    }

    return Promise.reject(new Error(`Invalid tag content: [${tagContent}]`));
  };
};

const createCommandDispatcher = (options: TIncludoOptions) => {
  const partMapProvider = createPartMapProvider(
    fileContentProvider,
    createPartTagProvider(options),
    MARK_NAME_REGEXP
  );
  const partContentProvider = createPartContentProvider(
    partMapProvider,
    MARK_NAME_REGEXP
  );

  const fileNameResolver = createFileNameResolver(options.resourceDir);
  const partCmdMatcher = createHeadTailMatcher(/part:/);

  return async (fileName: string, restOfLine: string): Promise<string[]> => {
    const resolvedFileName = fileNameResolver(fileName);
    if (restOfLine === '') {
      return await fileContentProvider(resolvedFileName);
    }
    if (partCmdMatcher.test(restOfLine)) {
      return partContentProvider(
        resolvedFileName,
        partCmdMatcher.tail(restOfLine)
      );
    }
    return Promise.reject(new Error(`Unknown command name: [${restOfLine}]`));
  };
};

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
import {createMarkMapProvider} from './mark_map_provider';
import {createMarkContentProvider} from './mark_content_provider';
import {createMarkTagProvider} from './mark_tag_provider';
import {createFirstAndRestMatcher} from '../utils/first_and_rest_matcher';

const log = appLog.extend('insertionDispatcher');

export const createInsertionDispatcher = (options: TIncludoOptions) => {
  // https://stackoverflow.com/questions/6768779/test-filename-with-regular-expression
  const FILEPATH_REGEXP = /[^<>;,?"*| ]+/;
  const FILEPATH_QUOTED_REGEXP = /"[^<>;,?"*|]+"/;
  const fileNameMatcher = createFirstAndRestMatcher(FILEPATH_REGEXP);
  const fileNameQuotedMatcher = createFirstAndRestMatcher(
    FILEPATH_QUOTED_REGEXP
  );
  const commandDispatcher = createCommandDispatcher(options);

  log(`CREATE insertionDispatcher. BaseDir: [${options.baseDir}]`);
  return async (tagContent: string): Promise<string> => {
    log(`call on [${tagContent}]`);
    if (tagContent.length === 0) {
      return Promise.reject(new Error('empty tag not allowed!'));
    }

    if (fileNameMatcher.test(tagContent)) {
      return commandDispatcher(
        fileNameMatcher.first(tagContent),
        fileNameMatcher.rest(tagContent)
      );
    }
    if (fileNameQuotedMatcher.test(tagContent)) {
      //remove quotes
      const fileNameWithoutQuotes = fileNameQuotedMatcher
        .first(tagContent)
        .slice(1, -1);
      return commandDispatcher(
        fileNameWithoutQuotes,
        fileNameQuotedMatcher.rest(tagContent)
      );
    }

    return Promise.reject(new Error(`Invalid tag content: [${tagContent}]`));
  };
};

const createCommandDispatcher = (options: TIncludoOptions) => {
  const markMapProvider = createMarkMapProvider(
    fileContentProvider,
    createMarkTagProvider(options),
    MARK_NAME_REGEXP
  );
  const markContentProvider = createMarkContentProvider(
    markMapProvider,
    MARK_NAME_REGEXP
  );

  const fileNameResolver = createFileNameResolver(options.baseDir);
  const markCmdMatcher = createFirstAndRestMatcher(/mark:/);

  return (fileName: string, restOfLine: string): Promise<string> => {
    const resolvedFileName = fileNameResolver(fileName);
    if (restOfLine === '') {
      return fileContentProvider(resolvedFileName);
    }
    if (markCmdMatcher.test(restOfLine)) {
      return markContentProvider(
        resolvedFileName,
        markCmdMatcher.rest(restOfLine)
      );
    }
    return Promise.reject(new Error(`Unknown command name: [${restOfLine}]`));
  };
};

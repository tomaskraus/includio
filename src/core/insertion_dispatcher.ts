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

  const restOfLineDispatcher = createRestOfLineDispatcher(options);

  log(`CREATE insertionDispatcher. BaseDir: [${options.baseDir}]`);
  return async (tagContent: string): Promise<string> => {
    log(`call on [${tagContent}]`);
    if (tagContent.length === 0) {
      return Promise.reject(new Error('empty tag not allowed!'));
    }

    if (fileNameMatcher.test(tagContent)) {
      return restOfLineDispatcher(
        fileNameMatcher.first(tagContent),
        fileNameMatcher.rest(tagContent)
      );
    }
    if (fileNameQuotedMatcher.test(tagContent)) {
      //remove quotes
      const fileNameWithoutQuotes = fileNameQuotedMatcher
        .first(tagContent)
        .slice(1, -1);
      return restOfLineDispatcher(
        fileNameWithoutQuotes,
        fileNameQuotedMatcher.rest(tagContent)
      );
    }

    return Promise.reject(new Error(`Invalid tag content: [${tagContent}]`));
  };
};

const createRestOfLineDispatcher = (options: TIncludoOptions) => {
  const fileNameResolver = createFileNameResolver(options.baseDir);
  const markTagProvider = createMarkTagProvider(options);
  const markMapProvider = createMarkMapProvider(
    fileContentProvider,
    markTagProvider
  );
  const markContentProvider = createMarkContentProvider(
    markMapProvider,
    MARK_NAME_REGEXP
  );

  return (fileName: string, restOfLine: string): Promise<string> => {
    const resolvedFileName = fileNameResolver(fileName);
    if (restOfLine === '') {
      return fileContentProvider(resolvedFileName);
    }
    if (MARK_NAME_REGEXP.test(restOfLine)) {
      return markContentProvider(resolvedFileName, restOfLine);
    }
    // return Promise.reject(new Error(`Invalid tag content: [${restOfLine}]`));
    return Promise.reject(new Error(`Invalid mark name: [${restOfLine}]`));
  };
};

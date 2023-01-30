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
  log(`CREATE insertionDispatcher. BaseDir: [${options.resourceDir}]`);

  const getLines = createGetLines(options);

  return async (tagContent: string): Promise<string> => {
    log(`call on [${tagContent}]`);
    if (tagContent.length === 0) {
      return Promise.reject(new Error('empty tag not allowed!'));
    }

    const lines = await getLines(tagContent);
    return lines.join('\n');
  };
};

const createParseFileName = () => {
  // https://stackoverflow.com/questions/6768779/test-filename-with-regular-expression
  const FILEPATH_REGEXP = /[^<>;,?"*| ]+/;
  const FILEPATH_QUOTED_REGEXP = /"[^<>;,?"*|]+"/;
  const fileNameMatcher = createHeadTailMatcher(FILEPATH_REGEXP);
  const fileNameQuotedMatcher = createHeadTailMatcher(FILEPATH_QUOTED_REGEXP);

  return (line: string): string => {
    if (fileNameMatcher.test(line) && fileNameMatcher.tail(line) === '') {
      return fileNameMatcher.head(line);
    }
    if (
      fileNameQuotedMatcher.test(line) &&
      fileNameQuotedMatcher.tail(line) === ''
    ) {
      //remove quotes
      return fileNameQuotedMatcher.head(line).slice(1, -1);
    }
    throw new Error(`Invalid file name format: [${line}]
    File name contains spaces. Enclose such a file name in quotes.`);
  };
};

const createGetLines = (options: TIncludoOptions) => {
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
  const parseFileName = createParseFileName();

  return async (tagContent: string): Promise<string[]> => {
    const tokens = tagContent.split(':');
    const fileName = fileNameResolver(parseFileName(tokens[0]));

    if (tokens.length === 1) {
      return fileContentProvider(fileName);
    }
    if (tokens.length === 2) {
      return partContentProvider(fileName, tokens[1].trim());
    }
    throw new Error(`Invalid format: [${tagContent}]`);
  };
};

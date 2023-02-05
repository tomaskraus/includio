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
import {createSeparatorMatcher} from '../utils/separator_matcher';

const log = appLog.extend('insertionDispatcher');

export const createInsertionDispatcher = (options: TIncludoOptions) => {
  log(`CREATE insertionDispatcher. resourceDir: [${options.resourceDir}]`);

  const getLines = createGetLines(options, PART_NAME_REGEXP);
  const lineDispatcher = createLineDispatcher(COMMAND_NAME_REGEXP);

  const pipeSeparatorMatcher = createSeparatorMatcher('\\|');

  return async (tagContent: string): Promise<string> => {
    log(`call on [${tagContent}]`);
    if (tagContent.trim().length === 0) {
      return Promise.reject(new Error('empty tag not allowed!'));
    }
    const [contentSelector, commands] =
      pipeSeparatorMatcher.headTail(tagContent);
    const input = await getLines(contentSelector);
    const result = lineDispatcher(input, commands);
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

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
  TIncludioOptions,
  createFileNameResolver,
  parseFileName,
  getIndentStr,
} from './common';
import {fileContentProvider} from './file_content_provider';
import {createPartMapProvider} from './part_map_provider';
import {createPartContentProvider} from './part_content_provider';
import {createCommentManager} from './comment_manager';
import {createLineDispatcher} from './line_dispatcher';
import {createSeparatorMatcher} from '../utils/separator_matcher';
import {createFirstMatcher} from '../utils/first_matcher';

const log = appLog.extend('insertionDispatcher');

export const createInsertionDispatcher = (options: TIncludioOptions) => {
  log(`CREATE insertionDispatcher. resourceDir: [${options.resourceDir}]`);

  const getLines = createGetLines(options, PART_NAME_REGEXP);
  const lineDispatcher = createLineDispatcher(COMMAND_NAME_REGEXP);

  const directiveMatcher = createFirstMatcher(options.directiveTag);
  const pipeSeparatorMatcher = createSeparatorMatcher('\\|');

  return async (directiveLine: string): Promise<string> => {
    log(`call on [${directiveLine}]`);
    const directiveContent = directiveMatcher.tail(directiveLine);
    if (directiveContent.trim().length === 0) {
      return Promise.reject(new Error('empty directive not allowed!'));
    }

    const indentStr = getIndentStr(directiveLine);
    const [contentSelector, commands] =
      pipeSeparatorMatcher.headTail(directiveContent);
    const input = await getLines(contentSelector);
    const result = lineDispatcher(input, commands);
    return result.map(s => indentStr + s).join('\n');
  };
};

//---------------------------------------------------------------------------------------

const createGetLines = (options: TIncludioOptions, partNameRegexp: RegExp) => {
  const partMapProvider = createPartMapProvider(
    fileContentProvider,
    createCommentManager(options).startTag,
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
      const partNameMatcher = createFirstMatcher(partNameRegexp);
      if (!partNameMatcher.test(tokens[1])) {
        throw new Error(`Part: invalid value: (${tokens[1]})`);
      }
      const partName = partNameMatcher.head(tokens[1]);
      return partContentProvider(fileName, partName);
    }
    throw new Error(`Only one part allowed: (${contentSelector})`);
  };
};

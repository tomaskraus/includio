import {defaultValue} from '../utils';
import {logger, TIncludoOptions, createFileNameResolver} from './common';
import {fileContentProvider} from './file_content_provider';
import {createMarkMapProvider} from './mark_map_provider';
import {createMarkContentProvider} from './mark_content_provider';
import {createMarkTagProvider} from './mark_tag_provider';

const log = logger('includo:insertionDispatcher');

// https://stackoverflow.com/questions/6768779/test-filename-with-regular-expression
const _FILEPATH_CHARS_REGEXP = /[^<>;,?"*|]+/;
const _FILEPATH_CHARS_NO_SPACE_REGEXP = /[^<>;,?"*| ]+/;
const _MARK_NAME_REGEXP = /[a-zA-z]+[\w\d-]*/;

const ONLY_FILENAME_REGEXP = new RegExp(
  `^(${_FILEPATH_CHARS_NO_SPACE_REGEXP.source})$|^"(${_FILEPATH_CHARS_REGEXP.source})"$`
);
const FILENAME_AND_MARK_REGEXP = new RegExp(
  `^(${_FILEPATH_CHARS_NO_SPACE_REGEXP.source})\\s+(${_MARK_NAME_REGEXP.source})$|^"(${_FILEPATH_CHARS_REGEXP.source})"\\s+(${_MARK_NAME_REGEXP.source})$`
);

export const createInsertionDispatcher = (options: TIncludoOptions) => {
  const markTagProvider = createMarkTagProvider(options);
  const markMapProvider = createMarkMapProvider(
    fileContentProvider,
    markTagProvider
  );
  const markContentProvider = createMarkContentProvider(markMapProvider);
  const fileNameResolver = createFileNameResolver(options.baseDir);
  log(`CREATE insertionDispatcher. BaseDir: [${options.baseDir}]`);
  return async (tagContent: string): Promise<string> => {
    log(`call on [${tagContent}]`);
    if (tagContent.length === 0) {
      return Promise.reject(new Error('empty tag not allowed!'));
    }
    if (ONLY_FILENAME_REGEXP.test(tagContent)) {
      const matches = defaultValue([''])(
        tagContent.match(ONLY_FILENAME_REGEXP)
      );
      const fileName = fileNameResolver(matches[1] || matches[2]); //either with or without double quotes
      return fileContentProvider(fileName);
    }
    if (FILENAME_AND_MARK_REGEXP.test(tagContent)) {
      const matches = defaultValue([''])(
        tagContent.match(FILENAME_AND_MARK_REGEXP)
      );
      const fileName = fileNameResolver(matches[1] || matches[3]); //either with or without double quotes
      const markName = matches[2] || matches[4];
      return markContentProvider(fileName, markName);
    }

    return Promise.reject(new Error(`Invalid tag content: [${tagContent}]`));
  };
};

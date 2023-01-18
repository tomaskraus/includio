import {defaultValue} from '../utils';
import {TIncludoOptions, logger} from './common';
import {createFileContentProvider} from './file_content_provider';
import {createMarkContentProvider} from './mark_content_provider';

const log = logger('includo:insertionDispatcher');

// https://stackoverflow.com/questions/6768779/test-filename-with-regular-expression
const _FILEPATH_CHARS_REGEXP = /[^<>;,?"*|]+/;
const _FILEPATH_CHARS_NO_SPACE_REGEXP = /[^<>;,?"*| ]+/;

const ONLY_FILENAME_WITH_NO_SPACES_REGEXP = new RegExp(
  `^(${_FILEPATH_CHARS_NO_SPACE_REGEXP.source})$`
);

const ONLY_QUOTED_FILENAME_REGEXP = new RegExp(
  `^"(${_FILEPATH_CHARS_REGEXP.source})"$`
);

const ONLY_FILENAME_REGEXP = new RegExp(
  `${ONLY_FILENAME_WITH_NO_SPACES_REGEXP.source}|${ONLY_QUOTED_FILENAME_REGEXP.source}`
);

const _MARK_NAME_REGEXP = /[a-zA-z]+[\w\d-]*/;

const FILENAME_AND_MARK_REGEXP = new RegExp(
  `^(${_FILEPATH_CHARS_NO_SPACE_REGEXP.source})\\s+(${_MARK_NAME_REGEXP.source})$|^"(${_FILEPATH_CHARS_REGEXP.source})"\\s+(${_MARK_NAME_REGEXP.source})$`
);

export const createInsertionDispatcher = (options: TIncludoOptions) => {
  const fileContentProvider = createFileContentProvider(options.baseDir);
  const markContentProvider = createMarkContentProvider(
    fileContentProvider,
    '//<',
    '//>'
  );
  log('CREATE InsertionDispatcher');
  return async (tagContent: string): Promise<string> => {
    log(`call on [${tagContent}]`);
    if (tagContent.length === 0) {
      return Promise.reject(new Error('empty tag not allowed!'));
    }
    if (ONLY_FILENAME_REGEXP.test(tagContent)) {
      const matches = defaultValue([''])(
        tagContent.match(ONLY_FILENAME_REGEXP)
      );
      const fileName = matches[1] || matches[2]; //either with or without double quotes
      return fileContentProvider(fileName);
    }
    if (FILENAME_AND_MARK_REGEXP.test(tagContent)) {
      const matches = defaultValue([''])(
        tagContent.match(FILENAME_AND_MARK_REGEXP)
      );
      const fileName = matches[1] || matches[3]; //either with or without double quotes
      const markName = matches[2] || matches[4];
      return markContentProvider(fileName, markName);
    }

    return Promise.reject(new Error(`Invalid tag content: [${tagContent}]`));
  };
};

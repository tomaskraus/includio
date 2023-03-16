/**
 * commentManager
 *
 * Provides right comment marks for a file name, based on its extension.
 *
 * @example
 ```ts
    const startCommentTagProvider = createCommentManager({DEFAULT_INCLUDIO_OPTIONS}).startTag;
    startCommentTagProvider('test.ts') === '//';
    startCommentTagProvider('anotherTest.sh') === '#';
 ```
 */

import {TIncludioOptions, appLog} from './common';
import path from 'node:path';

const log = appLog.extend('commentManager');

export const createCommentManager = (options: TIncludioOptions) => {
  log('CREATE commentManager');

  const defaultCommentPair = options.defaultCommentPair;
  const defaultStartComment = options.defaultCommentPair[0];
  const defaultEndComment = options.defaultCommentPair[1];

  const commentPairMap = options.commentPairMap.reduce(
    (acc, [key, startComment, endComment]) =>
      acc.set(key.toLowerCase(), [startComment, endComment]),
    new Map<string, [string, string]>()
  );
  log(`Extension map size: ${commentPairMap.size}`);

  return {
    defaultStartComment,
    defaultEndComment,
    startTag: (fileName: string): string => {
      const extension: string = path.extname(fileName).slice(1).toLowerCase(); //remove leading dot
      const startCommentTag = (commentPairMap.get(extension) ||
        defaultCommentPair)[0];
      log(
        `start comment tag for [${fileName}] with extension [${extension}]: [${startCommentTag}]`
      );
      return startCommentTag;
    },
    endTag: (fileName: string): string => {
      const extension: string = path.extname(fileName).slice(1).toLowerCase();
      const endCommentTag = (commentPairMap.get(extension) ||
        defaultCommentPair)[1];
      log(
        `end comment tag for [${fileName}] with extension [${extension}]: [${endCommentTag}]`
      );
      return endCommentTag;
    },
  };
};

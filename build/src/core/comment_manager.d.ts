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
import { TIncludioOptions } from './common';
export declare const createCommentManager: (options: TIncludioOptions) => {
    defaultStartComment: string;
    defaultEndComment: string;
    startTag: (fileName: string) => string;
    endTag: (fileName: string) => string;
};

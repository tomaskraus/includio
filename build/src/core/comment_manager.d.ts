/**
 * commentManager
 *
 * Provides right comment marks for a file name, based on its extension.
 *
 * @example
 ```ts
    const startCommentTagProvider = createCommentManager({DEFAULT_INCLUDO_OPTIONS}).startTag;
    startCommentTagProvider('test.ts') === '//';
    startCommentTagProvider('anotherTest.sh') === '#';
 ```
 */
import { TIncludoOptions } from './common';
export declare const createCommentManager: (options: TIncludoOptions) => {
    defaultStartComment: string;
    defaultEndComment: string;
    startTag: (fileName: string) => string;
    endTag: (fileName: string) => string;
};

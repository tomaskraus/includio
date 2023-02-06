/**
 * commentTagProvider
 *
 * for a file name, returns a comment tag string fot that file type.
 * That string should be suitable to be included in regExp.
 * Comment tag string may include a % character
 *
 * @example
 ```ts
  const commentTagProvider = createCommentTagProvider(DEFAULT_INCLUDO_OPTIONS);
  commentTagProvider('ts') === '//';
  commentTagProvider('sh') === '#';
 ```
 */
import { TIncludoOptions } from './common';
export declare const createCommentTagProvider: (options: TIncludoOptions) => (fileNameExtension: string) => string;

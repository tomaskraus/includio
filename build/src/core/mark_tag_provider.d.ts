/**
 * MarkTagProvider
 *
 * for a file name, returns a pair [opening, closing] marks fot that file type.
 */
import { TIncludoOptions } from './common';
export type TMarkTag = [string, string];
export declare const createMarkTagProvider: (options: TIncludoOptions) => (fileName: string) => TMarkTag;

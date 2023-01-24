/**
 * partTagProvider
 *
 * for a file name, returns a pair [opening, closing] parts fot that file type.
 */
import { TIncludoOptions } from './common';
export type TpartTag = [string, string];
export declare const createPartTagProvider: (options: TIncludoOptions) => (fileName: string) => TpartTag;

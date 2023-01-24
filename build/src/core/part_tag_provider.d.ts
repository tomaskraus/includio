/**
 * partTagProvider
 *
 * for a file name, returns a pair [opening, closing] parts fot that file type.
 */
import { TIncludoOptions } from './common';
export declare const createPartTagProvider: (options: TIncludoOptions) => (fileName: string) => string;

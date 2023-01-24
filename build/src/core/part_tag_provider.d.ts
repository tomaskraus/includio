/**
 * partTagProvider
 *
 * for a file name, returns a part tag string fot that file type.
 */
import { TIncludoOptions } from './common';
export declare const createPartTagProvider: (options: TIncludoOptions) => (fileName: string) => string;

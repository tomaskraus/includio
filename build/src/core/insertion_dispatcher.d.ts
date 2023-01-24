/**
 * InsertionDispatcher
 *
 * gets an input line,
 * returns a string content that depends on a command on that input line
 */
import { TIncludoOptions } from './common';
export declare const createInsertionDispatcher: (options: TIncludoOptions) => (tagContent: string) => Promise<string>;

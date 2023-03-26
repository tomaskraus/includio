/**
 * InsertionDispatcher
 *
 * gets an input line,
 * returns a string content that depends on a command on that input line
 */
import { TIncludioOptions } from './common';
export declare const createInsertionDispatcher: (options: TIncludioOptions) => (directiveLine: string) => Promise<string>;

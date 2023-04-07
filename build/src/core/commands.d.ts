/**
 * Directive command. Tells what to do with the resource content before it is inserted.
 *
 * Directive commands can be pipelined.
 */
export type TIncludioCommand = (lines: string[], ...args: string[]) => string[];
/**
 * Returns first n lines of a content.
 *
 * @param content input
 * @param count n (unparsed)
 * @param restMark adds this string at the end if the content has more than n lines
 * @returns first n input lines
 */
export declare const cmdFirst: TIncludioCommand;
/**
 * Returns last n lines of a content.
 *
 * @param content input
 * @param count n (unparsed)
 * @param restMark adds this string at the beginning if the content has more than n lines
 * @returns last n input lines
 */
export declare const cmdLast: TIncludioCommand;

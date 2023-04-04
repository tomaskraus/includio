/**
 * Directive command. Tells what to do with the resource content before it is inserted.
 *
 * Directive commands can be pipelined.
 */
export type TIncludioCommand = (lines: string[], ...args: string[]) => string[];
/**
 * Returns first n input lines.
 *
 * @param lines input
 * @param countStr n (unparsed)
 * @param moreContentMark adds this string at the end if input has more lines than n
 * @returns first n input lines
 */
export declare const cmdFirst: TIncludioCommand;
/**
 * Returns last n input lines.
 *
 * @param lines input
 * @param countStr (unparsed)
 * @param moreContentMark adds this string at the beginning if input has more lines than n
 * @returns last n input lines
 */
export declare const cmdLast: TIncludioCommand;

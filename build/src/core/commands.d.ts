/**
 * Insertion command. Tells what to do with the source before it is inserted.
 *
 * Insertion line consists of three parts:
 * - insertion tag
 * - source selector
 * - insertion command(s) (not mandatory)
 *
 * Insertion commands can be pipelined.
 */
export type TIncludoCommand = (lines: string[], ...args: string[]) => string[];
/**
 * @param lines input
 * @param countStr n
 * @param moreContentMark adds this string at the end if input has more lines than n
 * @returns first n lines
 */
export declare const cmdFirst: TIncludoCommand;
/**
 * @param lines input
 * @param countStr n
 * @param moreContentMark adds this string at the beginning if input has more lines than n
 * @returns last n lines
 */
export declare const cmdLast: TIncludoCommand;

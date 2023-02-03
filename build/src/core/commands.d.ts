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
export type TIncludoCommand = (lines: string[], args: string[]) => string[];
/**
 * returns first n lines
 * args[0]: n
 * args[1]: optional more-content-mark string
 *
 * @param lines
 * @param args
 * @returns
 */
export declare const cmdFirst: TIncludoCommand;
/**
 * returns last n lines
 * args[0]: n
 * args[1]: optional more-content-mark string
 *
 * @param lines
 * @param args
 * @returns
 */
export declare const cmdLast: TIncludoCommand;

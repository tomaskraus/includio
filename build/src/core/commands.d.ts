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
export declare const cmdFirst: TIncludoCommand;

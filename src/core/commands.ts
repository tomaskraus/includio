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

export const cmdFirst: TIncludoCommand = (lines: string[], args: string[]) => {
  if (args.length === 0 || args[0] === '') {
    throw new Error(
      'Positive integer argument required\n' + 'Example: first 3'
    );
  }
  return lines.slice(0, 3);
};

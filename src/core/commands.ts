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

import {createIntegerValidator} from '../utils/integer_validator';

export type TIncludoCommand = (lines: string[], args: string[]) => string[];

const positiveIntegerValidator = createIntegerValidator(1);

/**
 * returns first n lines
 * args[0]: n
 * args[1]: optional more-content-mark string
 *
 * @param lines
 * @param args
 * @returns
 */
export const cmdFirst: TIncludoCommand = (lines: string[], args: string[]) => {
  const maxLineCount = positiveIntegerValidator(
    args[0],
    'first <number>, [<string>]'
  );
  const content = lines.slice(0, maxLineCount);
  if (args[1] && maxLineCount < lines.length) {
    return [...content, args[1].trim()];
  }
  return content;
};

/**
 * returns last n lines
 * args[0]: n
 * args[1]: optional more-content-mark string
 *
 * @param lines
 * @param args
 * @returns
 */
export const cmdLast: TIncludoCommand = (lines: string[], args: string[]) => {
  const maxLineCount = positiveIntegerValidator(
    args[0],
    'last <number>, [<string>]'
  );
  const content = lines.slice(-maxLineCount);
  if (args[1] && maxLineCount < lines.length) {
    return [args[1].trim(), ...content];
  }
  return content;
};

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

export const cmdFirst: TIncludoCommand = (lines: string[], args: string[]) => {
  const maxLineCount = positiveIntegerValidator(
    args[0],
    'first <maxLineCount: number>'
  );
  const content = lines.slice(0, maxLineCount);
  if (maxLineCount < lines.length) {
    return [...content, '...'];
  }
  return content;
};

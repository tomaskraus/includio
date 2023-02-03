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

export type TIncludoCommand = (lines: string[], ...args: string[]) => string[];

const positiveIntegerValidator = createIntegerValidator(1);

/**
 * Returns first n input lines.
 *
 * @param lines input
 * @param countStr n (unparsed)
 * @param moreContentMark adds this string at the end if input has more lines than n
 * @returns first n input lines
 */
export const cmdFirst: TIncludoCommand = (
  lines: string[],
  countStr: string,
  moreContentMark?: string
) => {
  const maxLineCount = positiveIntegerValidator(
    countStr,
    'first <number>, [<string>]'
  );
  const content = lines.slice(0, maxLineCount);
  if (moreContentMark && maxLineCount < lines.length) {
    return [...content, moreContentMark];
  }
  return content;
};

/**
 * Returns last n input lines.
 *
 * @param lines input
 * @param countStr (unparsed)
 * @param moreContentMark adds this string at the beginning if input has more lines than n
 * @returns last n input lines
 */
export const cmdLast: TIncludoCommand = (
  lines: string[],
  countStr: string,
  moreContentMark?: string
) => {
  const maxLineCount = positiveIntegerValidator(
    countStr,
    'last <number>, [<string>]'
  );
  const content = lines.slice(-maxLineCount);
  if (moreContentMark && maxLineCount < lines.length) {
    return [moreContentMark, ...content];
  }
  return content;
};

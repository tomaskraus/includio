/**
 * Directive command. Tells what to do with the resource content before it is inserted.
 *
 * Directive commands can be pipelined.
 */

import {createIntegerValidator} from '../utils/integer_validator';

export type TIncludioCommand = (lines: string[], ...args: string[]) => string[];

const positiveIntegerValidator = createIntegerValidator(1);

/**
 * Returns first n input lines.
 *
 * @param lines input
 * @param countStr n (unparsed)
 * @param moreContentMark adds this string at the end if input has more lines than n
 * @returns first n input lines
 */
export const cmdFirst: TIncludioCommand = (
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
export const cmdLast: TIncludioCommand = (
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

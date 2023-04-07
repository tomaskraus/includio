/**
 * Directive command. Tells what to do with the resource content before it is inserted.
 *
 * Directive commands can be pipelined.
 */

import {createIntegerValidator} from '../utils/integer_validator';

export type TIncludioCommand = (lines: string[], ...args: string[]) => string[];

const positiveIntegerValidator = createIntegerValidator(1);

/*
//< first
syntax:
```
first <count> [, <restMark>]
```
Returns the first _count_ lines of a content.

//< first-example
@@ example.js | first 2
//<
*/
/**
 * Returns first n lines of a content.
 *
 * @param content input
 * @param count n (unparsed)
 * @param restMark adds this string at the end if the content has more than n lines
 * @returns first n input lines
 */
export const cmdFirst: TIncludioCommand = (
  content: string[],
  count: string,
  restMark?: string
) => {
  const maxLineCount = positiveIntegerValidator(count, 'count');
  const finalContent = content.slice(0, maxLineCount);
  if (restMark && maxLineCount < content.length) {
    return [...finalContent, restMark];
  }
  return finalContent;
};

/*
//< last
syntax:
```
last <count> [, <restMark>]
```
Returns the last _count_ lines of a content.

//< last-example
@@ example.js | last 2
//<
*/
/**
 * Returns last n lines of a content.
 *
 * @param content input
 * @param count n (unparsed)
 * @param restMark adds this string at the beginning if the content has more than n lines
 * @returns last n input lines
 */
export const cmdLast: TIncludioCommand = (
  content: string[],
  count: string,
  restMark?: string
) => {
  const maxLineCount = positiveIntegerValidator(count, 'count');
  const finalContent = content.slice(-maxLineCount);
  if (restMark && maxLineCount < content.length) {
    return [restMark, ...finalContent];
  }
  return finalContent;
};

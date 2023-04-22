"use strict";
/**
 * Directive command. Tells what to do with the resource content before it is inserted.
 *
 * Directive commands can be pipelined.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.cmdLast = exports.cmdFirst = void 0;
const integer_validator_1 = require("../utils/integer_validator");
const positiveIntegerValidator = (0, integer_validator_1.createIntegerValidator)(1);
/*
undocumented: first <count> [, <restMark>]
//< first
syntax:
```
first <count>
```
Returns the first _count_ lines of a content.

//< first-resource
@@ example.js
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
const cmdFirst = (content, count, restMark) => {
    const maxLineCount = positiveIntegerValidator(count, 'count');
    const finalContent = content.slice(0, maxLineCount);
    if (restMark && maxLineCount < content.length) {
        return [...finalContent, restMark];
    }
    return finalContent;
};
exports.cmdFirst = cmdFirst;
/*
undocumented: last <count> [, <restMark>]
//< last
syntax:
```
last <count>
```
Returns the last _count_ lines of a content. May return fewer lines if the content have less than _count_ lines.

//< last-resource
@@ example.js
//< last-example
@@ example.js | last 3
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
const cmdLast = (content, count, restMark) => {
    const maxLineCount = positiveIntegerValidator(count, 'count');
    const finalContent = content.slice(-maxLineCount);
    if (restMark && maxLineCount < content.length) {
        return [restMark, ...finalContent];
    }
    return finalContent;
};
exports.cmdLast = cmdLast;
//# sourceMappingURL=commands.js.map
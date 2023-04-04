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
/**
 * Returns first n input lines.
 *
 * @param lines input
 * @param countStr n (unparsed)
 * @param moreContentMark adds this string at the end if input has more lines than n
 * @returns first n input lines
 */
const cmdFirst = (lines, countStr, moreContentMark) => {
    const maxLineCount = positiveIntegerValidator(countStr, 'first <number>, [<string>]');
    const content = lines.slice(0, maxLineCount);
    if (moreContentMark && maxLineCount < lines.length) {
        return [...content, moreContentMark];
    }
    return content;
};
exports.cmdFirst = cmdFirst;
/**
 * Returns last n input lines.
 *
 * @param lines input
 * @param countStr (unparsed)
 * @param moreContentMark adds this string at the beginning if input has more lines than n
 * @returns last n input lines
 */
const cmdLast = (lines, countStr, moreContentMark) => {
    const maxLineCount = positiveIntegerValidator(countStr, 'last <number>, [<string>]');
    const content = lines.slice(-maxLineCount);
    if (moreContentMark && maxLineCount < lines.length) {
        return [moreContentMark, ...content];
    }
    return content;
};
exports.cmdLast = cmdLast;
//# sourceMappingURL=commands.js.map
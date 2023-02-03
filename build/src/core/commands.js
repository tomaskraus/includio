"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.cmdLast = exports.cmdFirst = void 0;
const integer_validator_1 = require("../utils/integer_validator");
const positiveIntegerValidator = (0, integer_validator_1.createIntegerValidator)(1);
/**
 * returns first n lines
 * args[0]: n
 * args[1]: optional more-content-mark string
 *
 * @param lines
 * @param args
 * @returns
 */
const cmdFirst = (lines, args) => {
    const maxLineCount = positiveIntegerValidator(args[0], 'first <number>, [<string>]');
    const content = lines.slice(0, maxLineCount);
    if (args[1] && maxLineCount < lines.length) {
        return [...content, args[1].trim()];
    }
    return content;
};
exports.cmdFirst = cmdFirst;
/**
 * returns last n lines
 * args[0]: n
 * args[1]: optional more-content-mark string
 *
 * @param lines
 * @param args
 * @returns
 */
const cmdLast = (lines, args) => {
    const maxLineCount = positiveIntegerValidator(args[0], 'last <number>, [<string>]');
    const content = lines.slice(-maxLineCount);
    if (args[1] && maxLineCount < lines.length) {
        return [args[1].trim(), ...content];
    }
    return content;
};
exports.cmdLast = cmdLast;
//# sourceMappingURL=commands.js.map
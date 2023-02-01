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
exports.cmdFirst = void 0;
const integer_validator_1 = require("../utils/integer_validator");
const positiveIntegerValidator = (0, integer_validator_1.createIntegerValidator)(1);
const cmdFirst = (lines, args) => {
    const maxLineCount = positiveIntegerValidator(args[0], 'first <maxLineCount: number>');
    const content = lines.slice(0, maxLineCount);
    if (maxLineCount < lines.length) {
        return [...content, '...'];
    }
    return content;
};
exports.cmdFirst = cmdFirst;
//# sourceMappingURL=commands.js.map
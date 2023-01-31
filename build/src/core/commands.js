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
const cmdFirst = (lines, args) => {
    if (args.length === 0 || args[0] === '') {
        throw new Error('Positive integer argument required\n' + 'Example: first 3');
    }
    return lines.slice(0, 3);
};
exports.cmdFirst = cmdFirst;
//# sourceMappingURL=commands.js.map
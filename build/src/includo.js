"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIncludoProcessor = exports.DEFAULT_INCLUDO_OPTIONS = void 0;
const comment_regexp_builder_1 = require("@krausoft/comment-regexp-builder");
const utils_1 = require("./utils");
const line_transform_machines_1 = require("line-transform-machines");
exports.DEFAULT_INCLUDO_OPTIONS = {
    tag_insert: '@@',
};
const insertionDispatcher = (command) => {
    if (command.length === 0) {
        throw new Error('empty tag not allowed!');
    }
    return '--insertion--';
};
const includerCB = (options) => {
    const tagForInsert = (0, comment_regexp_builder_1.createStartTag)(options.tag_insert);
    return (line) => {
        if (tagForInsert.test(line)) {
            return insertionDispatcher((0, utils_1.defaultValue)('')(tagForInsert.innerText(line)).trim());
        }
        return line;
    };
};
const createIncludoProcessor = (options) => {
    const opts = { ...exports.DEFAULT_INCLUDO_OPTIONS, options };
    return (0, line_transform_machines_1.createLineMachine)(includerCB(opts));
};
exports.createIncludoProcessor = createIncludoProcessor;
//# sourceMappingURL=includo.js.map
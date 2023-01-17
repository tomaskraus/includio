"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIncludoProcessor = exports.DEFAULT_INCLUDO_OPTIONS = void 0;
const comment_regexp_builder_1 = require("@krausoft/comment-regexp-builder");
const utils_1 = require("./utils");
const line_transform_machines_1 = require("line-transform-machines");
const insertion_dispatcher_1 = require("./core/insertion_dispatcher");
const common_1 = require("./core/common");
Object.defineProperty(exports, "DEFAULT_INCLUDO_OPTIONS", { enumerable: true, get: function () { return common_1.DEFAULT_INCLUDO_OPTIONS; } });
const includerCB = (options) => {
    const tagForInsert = (0, comment_regexp_builder_1.createStartTag)(options.tag_insert);
    return (line) => {
        if (tagForInsert.test(line)) {
            return (0, insertion_dispatcher_1.insertionFileDispatcher)((0, utils_1.defaultValue)('')(tagForInsert.innerText(line)).trim());
        }
        return line;
    };
};
const createIncludoProcessor = (options) => {
    const opts = { ...common_1.DEFAULT_INCLUDO_OPTIONS, options };
    return (0, line_transform_machines_1.createLineMachine)(includerCB(opts));
};
exports.createIncludoProcessor = createIncludoProcessor;
//# sourceMappingURL=includo.js.map
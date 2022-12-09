"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_INCLUDO_OPTIONS = void 0;
exports.DEFAULT_INCLUDO_OPTIONS = {
    tag_insert: '@@',
};
const createLineProcessor = (options) => {
    return async (line) => {
        return `*** ${line}\n`;
    };
};
//# sourceMappingURL=includo.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIncludoProcessor = exports.DEFAULT_INCLUDO_OPTIONS = void 0;
exports.DEFAULT_INCLUDO_OPTIONS = {
    tag_insert: '@@',
};
const createIncludoProcessor = (options) => {
    return async (line) => {
        return `*-* ${line}\n`;
    };
};
exports.createIncludoProcessor = createIncludoProcessor;
//# sourceMappingURL=includo.js.map
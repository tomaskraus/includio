"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSeparatorMatcher = void 0;
const createSeparatorMatcher = (separator) => {
    const headTail = (s) => {
        const headGroupReg = new RegExp(`\\s*([^${separator}]+)\\s*`);
        const reg = new RegExp(`^${headGroupReg.source}$|^${headGroupReg.source}${separator}(.*)$`);
        const matches = s.match(reg) || ['', ''];
        if (typeof matches[2] !== 'undefined') {
            return [matches[2].trim(), matches[3] || ''];
        }
        return [matches[1].trim(), ''];
    };
    return {
        headTail,
        head: (s) => headTail(s)[0],
        tail: (s) => headTail(s)[1],
    };
};
exports.createSeparatorMatcher = createSeparatorMatcher;
//# sourceMappingURL=separator_matcher.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHeadTailMatcher = void 0;
const createHeadTailMatcher = (separator) => {
    const headTail = (s) => {
        const headGroupReg = new RegExp(`\\s*([^${separator}]*)\\s*`);
        const reg = new RegExp(`^${headGroupReg.source}$|^${headGroupReg.source}${separator}(.*)$`);
        const matches = s.match(reg) || [''];
        if (typeof matches[2] !== 'undefined') {
            return [matches[2].trim(), matches[3] || ''];
        }
        if (typeof matches[1] !== 'undefined') {
            return [matches[1].trim(), ''];
        }
        return ['', ''];
    };
    return {
        headTail,
        head: (s) => headTail(s)[0],
        tail: (s) => headTail(s)[1],
    };
};
exports.createHeadTailMatcher = createHeadTailMatcher;
//# sourceMappingURL=head_tail_matcher.js.map
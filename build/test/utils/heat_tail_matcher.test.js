"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const head_tail_matcher_1 = require("../../src/utils/head_tail_matcher");
let matcher;
beforeEach(() => {
    matcher = (0, head_tail_matcher_1.createHeadTailMatcher)(' ');
});
describe('HeadTailMatcher', () => {
    test('on empty string, returns enmpty head and empty tail', () => {
        expect(matcher.headTail('')).toEqual(['', '']);
    });
});
//# sourceMappingURL=heat_tail_matcher.test.js.map
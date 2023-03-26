"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../src/core/common");
test('getIndentStr', () => {
    expect((0, common_1.getIndentStr)('')).toEqual('');
    expect((0, common_1.getIndentStr)(' ')).toEqual(' ');
    expect((0, common_1.getIndentStr)('abc')).toEqual('');
    expect((0, common_1.getIndentStr)('  abc ')).toEqual('  ');
});
//# sourceMappingURL=common.test.js.map
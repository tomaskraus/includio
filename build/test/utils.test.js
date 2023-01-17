"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../src/utils");
describe('defaultValue', () => {
    test('default if value is null', () => {
        expect((0, utils_1.defaultValue)('a')(null)).toEqual('a');
    });
    test('default if value is undefined', () => {
        expect((0, utils_1.defaultValue)('a')(undefined)).toEqual('a');
    });
    test('value if value is not null nor undefined', () => {
        expect((0, utils_1.defaultValue)('a')('xyz')).toEqual('xyz');
    });
});
//# sourceMappingURL=utils.test.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../src/utils");
describe('defaultValue', () => {
    const onEmptyNull_onNullUndefined = (x) => {
        if (x === '') {
            return null;
        }
        if (x === null) {
            return undefined;
        }
        return x;
    };
    test('default if func returns null', () => {
        expect((0, utils_1.defaultValue)('a', onEmptyNull_onNullUndefined)('')).toEqual('a');
    });
    test('default if func returns undefined', () => {
        expect((0, utils_1.defaultValue)('a', onEmptyNull_onNullUndefined)(null)).toEqual('a');
    });
    test('fn(x) if x is not null nor undefined', () => {
        expect((0, utils_1.defaultValue)('a', onEmptyNull_onNullUndefined)('xyz')).toEqual('xyz');
    });
});
//# sourceMappingURL=utils.test.js.map
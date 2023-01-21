"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const default_value_1 = require("../../src/utils/default_value");
describe('defaultValue', () => {
    test('default if value is null', () => {
        expect((0, default_value_1.defaultIfNullOrUndefined)('a')(null)).toEqual('a');
    });
    test('default if value is undefined', () => {
        expect((0, default_value_1.defaultIfNullOrUndefined)('a')(undefined)).toEqual('a');
    });
    test('value if value is not null nor undefined', () => {
        expect((0, default_value_1.defaultIfNullOrUndefined)('a')('xyz')).toEqual('xyz');
    });
});
//# sourceMappingURL=default_value.test.js.map
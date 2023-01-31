"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultIfNullOrUndefined = void 0;
/**
 * Default value helper written in a functional style.
 *
 * @param defaultVal a default value
 * @returns a one argument function that returns defaultVal, if the argument's value is null or undefined
 *
 * @example
    const safeStr = defaultIfNullOrUndefined('');
    safeStr(null) === ''; // true
    safeStr('abc') === 'abc'; // true
 */
const defaultIfNullOrUndefined = (defaultVal) => (value) => {
    if (typeof value === 'undefined')
        return defaultVal;
    if (value === null)
        return defaultVal;
    return value;
};
exports.defaultIfNullOrUndefined = defaultIfNullOrUndefined;
//# sourceMappingURL=default_value.js.map
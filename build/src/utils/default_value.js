"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultIfNullOrUndefined = void 0;
const defaultIfNullOrUndefined = (defaultVal) => (value) => {
    if (typeof value === 'undefined')
        return defaultVal;
    if (value === null)
        return defaultVal;
    return value;
};
exports.defaultIfNullOrUndefined = defaultIfNullOrUndefined;
//# sourceMappingURL=default_value.js.map
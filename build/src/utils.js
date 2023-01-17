"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultValue = void 0;
const defaultValue = (defaultVal) => (value) => {
    if (typeof value === 'undefined')
        return defaultVal;
    if (value === null)
        return defaultVal;
    return value;
};
exports.defaultValue = defaultValue;
//# sourceMappingURL=utils.js.map
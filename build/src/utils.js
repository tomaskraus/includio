"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultValue = void 0;
const defaultValue = (defaultVal, func) => (y) => {
    const res = func(y);
    if (typeof res === 'undefined') {
        return defaultVal;
    }
    if (res === null) {
        return defaultVal;
    }
    return res;
};
exports.defaultValue = defaultValue;
//# sourceMappingURL=utils.js.map
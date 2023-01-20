"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheOneArgFnAsync = exports.defaultValue = void 0;
const defaultValue = (defaultVal) => (value) => {
    if (typeof value === 'undefined')
        return defaultVal;
    if (value === null)
        return defaultVal;
    return value;
};
exports.defaultValue = defaultValue;
const cacheOneArgFnAsync = (asyncFn) => {
    const values = new Map();
    return async (value) => {
        let result = values.get(value);
        if (typeof result === 'undefined') {
            try {
                result = await asyncFn(value);
                values.set(value, result);
            }
            catch (err) {
                return Promise.reject(err);
            }
        }
        return Promise.resolve(result);
    };
};
exports.cacheOneArgFnAsync = cacheOneArgFnAsync;
//# sourceMappingURL=utils.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheOneArgFnAsync = void 0;
/**
 * caches function results, for an asynchronous function
 *
 * @param asyncFn original function
 * @returns function that behaves like the original function, caches its result.
 */
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
//# sourceMappingURL=cache_fn.js.map
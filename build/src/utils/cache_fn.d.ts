/**
 * cache function results, for an asynchronous function
 *
 * @param asyncFn original function
 * @returns function that behaves like the original function, caches its result.
 */
export declare const cacheOneArgFnAsync: <T, R>(asyncFn: (v: T) => Promise<R>) => (value: T) => Promise<R>;

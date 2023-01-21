export declare const defaultIfNullOrUndefined: <T>(defaultVal: T) => (value: T | null | undefined) => T;
export declare const cacheOneArgFnAsync: <T, R>(asyncFn: (v: T) => Promise<R>) => (value: T) => Promise<R>;

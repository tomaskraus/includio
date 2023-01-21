export const defaultValue =
  <T>(defaultVal: T) =>
  (value: T | null | undefined) => {
    if (typeof value === 'undefined') return defaultVal;
    if (value === null) return defaultVal;

    return value;
  };

export const cacheOneArgFnAsync = <T, R>(asyncFn: (v: T) => Promise<R>) => {
  const values = new Map<T, R>();
  return async (value: T): Promise<R> => {
    let result = values.get(value);
    if (typeof result === 'undefined') {
      try {
        result = await asyncFn(value);
        values.set(value, result);
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return Promise.resolve(result);
  };
};

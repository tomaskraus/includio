export const defaultIfNullOrUndefined =
  <T>(defaultVal: T) =>
  (value: T | null | undefined) => {
    if (typeof value === 'undefined') return defaultVal;
    if (value === null) return defaultVal;

    return value;
  };

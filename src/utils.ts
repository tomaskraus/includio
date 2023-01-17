export const defaultValue =
  <T, U>(defaultVal: T, func: (x: U) => T | null | undefined): ((y: U) => T) =>
  (y: U): T => {
    const res = func(y);
    if (typeof res === 'undefined') {
      return defaultVal;
    }
    if (res === null) {
      return defaultVal;
    }
    return res;
  };

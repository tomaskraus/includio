/**
 * Default value hepler written in a functional style.
 *
 * @param defaultVal a default value
 * @returns a one argument function that returns defaultVal, if the argument's value is null or undefined
 *
 * @example
    const safeStr = defaultIfNullOrUndefined('');
    safeStr(null) === ''; // true
    safeStr('abc') === 'abc'; // true
 */
export const defaultIfNullOrUndefined =
  <T>(defaultVal: T): ((value: T | null | undefined) => T) =>
  (value: T | null | undefined) => {
    if (typeof value === 'undefined') return defaultVal;
    if (value === null) return defaultVal;

    return value;
  };

/**
 * decimal integer parser and validator utility, written in functional style
 */

/**
 * Return a function that parses an integer value from string. That function does range checks, if min(/max) is provided to the creator.
 *
 * @param minValue Optional minimum allowed value
 * @param maxValue Optional maximum allowed value
 * @returns Return a function that parses an integer value from string.
 *
 * @example
  ```ts
    const integerBetween_1_And_6_Validator = createIntegerValidator(1, 6);

    integerBetween_1_And_6_Validator('3') === 3;
    assert.throws(() => integerBetween_1_And_6_Validator('hello'));
    assert.throws(() => integerBetween_1_And_6_Validator('0'));
    assert.throws(() => integerBetween_1_And_6_Validator('7'));
    assert.throws(() => integerBetween_1_And_6_Validator('1.5'));
  ```
 */
export const createIntegerValidator =
  (
    minValue: number = Number.MIN_SAFE_INTEGER,
    maxValue: number = Number.MAX_SAFE_INTEGER
  ) =>
  /**
   *
   * @param integerStr String to be parsed for an integer.
   * @param beginOfErrorMessageStr Begin of the error message. It will be added before the error reason description.
   * @returns Function that parses an integer value from string.
   */
  (integerStr: string, beginOfErrorMessageStr?: string) => {
    if (integerStr.length === 0) {
      throw createErrorObj('no integer value found', beginOfErrorMessageStr);
    }

    if (/\./.test(integerStr)) {
      throw createErrorObj(
        `value (${integerStr}) is not an integer`,
        beginOfErrorMessageStr
      );
    }

    const val = Number(integerStr);
    if (Number.isFinite(val)) {
      if (val < minValue) {
        throw createErrorObj(
          `value (${val}) is lower than a required minimum [${minValue}]`,
          beginOfErrorMessageStr
        );
      }
      if (val > maxValue) {
        throw createErrorObj(
          `value (${val}) is greater than a required maximum [${maxValue}]`,
          beginOfErrorMessageStr
        );
      }
      return val;
    }
    throw createErrorObj(
      `(${integerStr}) is not a number`,
      beginOfErrorMessageStr
    );
  };

const createErrorObj = (msg: string, errorMessageBegin?: string) => {
  return new Error(
    errorMessageBegin ? `${errorMessageBegin}: ${msg}` : `${msg}`
  );
};

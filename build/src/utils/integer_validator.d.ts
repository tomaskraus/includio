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
export declare const createIntegerValidator: (minValue?: number, maxValue?: number) => (str: string, errorMessageBeginning?: string) => number;

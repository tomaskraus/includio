import {createIntegerValidator} from '../../src/utils/integer_validator';

const validateInt = createIntegerValidator();
const validateIntMinMinus1Max10 = createIntegerValidator(-1, 10);

describe('IntegerValidator', () => {
  test('validates proper integer value', () => {
    expect(validateInt(' 5  ')).toEqual(5);
  });

  test('minValue: validates proper integer value', () => {
    const validateIntMin1 = createIntegerValidator(1);
    expect(validateIntMin1(' 90')).toEqual(90);
    expect(validateIntMin1(' 1')).toEqual(1);
  });

  test('maxValue: validates proper integer value', () => {
    const validateIntMax10 = createIntegerValidator(undefined, 10);
    expect(validateIntMax10(' -100')).toEqual(-100);
    expect(validateIntMax10(' 10')).toEqual(10);
  });

  test('minMaxValue: validates proper integer value', () => {
    expect(validateIntMinMinus1Max10(' 5')).toEqual(5);
  });

  test('minMaxValue: validates proper minimum integer value', () => {
    expect(validateIntMinMinus1Max10('-1 ')).toEqual(-1);
  });

  test('minMaxValue: validates proper maximum integer value', () => {
    expect(validateIntMinMinus1Max10('10')).toEqual(10);
  });
});

describe('IntegerValidator - errors', () => {
  test('float value', () => {
    expect(() => validateIntMinMinus1Max10(' 5.1')).toThrow('not an integer');
  });

  test('invalid characters in a string', () => {
    expect(() => validateIntMinMinus1Max10('1a')).toThrow('not a number');
  });

  test('all the characters non-numeric in a string', () => {
    expect(() => validateIntMinMinus1Max10(' hello ')).toThrow('not a number');
  });

  test('value is lower than the minimum', () => {
    expect(() => validateIntMinMinus1Max10(' -2 ')).toThrow('is lower than');
  });

  test('value is greater than the maximum', () => {
    expect(() => validateIntMinMinus1Max10(' 11 ')).toThrow('is greater than');
  });
});

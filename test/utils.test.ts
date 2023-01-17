import {defaultValue} from '../src/utils';

describe('defaultValue', () => {
  const onEmptyNull_onNullUndefined = (
    x: string | null
  ): string | null | undefined => {
    if (x === '') {
      return null;
    }
    if (x === null) {
      return undefined;
    }
    return x;
  };

  test('default if func returns null', () => {
    expect(defaultValue('a', onEmptyNull_onNullUndefined)('')).toEqual('a');
  });

  test('default if func returns undefined', () => {
    expect(defaultValue('a', onEmptyNull_onNullUndefined)(null)).toEqual('a');
  });

  test('fn(x) if x is not null nor undefined', () => {
    expect(defaultValue('a', onEmptyNull_onNullUndefined)('xyz')).toEqual(
      'xyz'
    );
  });
});

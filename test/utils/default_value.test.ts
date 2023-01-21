import {defaultIfNullOrUndefined} from '../../src/utils/default_value';

describe('defaultValue', () => {
  test('default if value is null', () => {
    expect(defaultIfNullOrUndefined('a')(null)).toEqual('a');
  });

  test('default if value is undefined', () => {
    expect(defaultIfNullOrUndefined('a')(undefined)).toEqual('a');
  });

  test('value if value is not null nor undefined', () => {
    expect(defaultIfNullOrUndefined('a')('xyz')).toEqual('xyz');
  });
});

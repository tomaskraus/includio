import {defaultValue} from '../src/utils';

describe('defaultValue', () => {
  test('default if value is null', () => {
    expect(defaultValue('a')(null)).toEqual('a');
  });

  test('default if value is undefined', () => {
    expect(defaultValue('a')(undefined)).toEqual('a');
  });

  test('value if value is not null nor undefined', () => {
    expect(defaultValue('a')('xyz')).toEqual('xyz');
  });
});

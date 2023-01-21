import {defaultIfNullOrUndefined, cacheOneArgFnAsync} from '../src/utils';

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

describe('cacheOneArgFnAsync', () => {
  let callCount = 0;

  const doubleFnAsync = (x: number) => {
    callCount++;
    return Promise.resolve(2 * x);
  };

  test('returns same values as the original fn', async () => {
    callCount = 0;
    const cachedFn = cacheOneArgFnAsync(doubleFnAsync);

    expect(await doubleFnAsync(3)).toEqual(6);
    expect(await cachedFn(3)).toEqual(6);

    expect(await doubleFnAsync(7)).toEqual(14);
    expect(await cachedFn(7)).toEqual(14);

    expect(await doubleFnAsync(-1)).toEqual(-2);
    expect(await cachedFn(-1)).toEqual(-2);

    expect(callCount).toEqual(6);
  });

  test('repeated cacheFn call with the same argument value returns cached value, does not call its inner function', async () => {
    callCount = 0;
    const cachedFn = cacheOneArgFnAsync(doubleFnAsync);

    expect(callCount).toEqual(0);
    expect(await cachedFn(3)).toEqual(6);
    expect(callCount).toEqual(1);
    expect(await cachedFn(3)).toEqual(6);
    expect(callCount).toEqual(1);

    expect(await cachedFn(0)).toEqual(0);
    expect(callCount).toEqual(2);
    expect(await cachedFn(3)).toEqual(6);
    expect(callCount).toEqual(2);
    expect(await cachedFn(0)).toEqual(0);
    expect(callCount).toEqual(2);
  });
});

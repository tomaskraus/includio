import {
  IFirstRestMatcher,
  createFirstRestMatcher,
} from '../../src/utils/first_rest_matcher';

let matcher: IFirstRestMatcher;

beforeEach(() => {
  matcher = createFirstRestMatcher(/\w+/);
});

describe('HeadTailMatcher', () => {
  test('does not match empty sample, returns empty strings', () => {
    expect(matcher.test('')).toBeFalsy();
    expect(matcher.firstRest('')).toEqual(['', '']);
    expect(matcher.first('')).toEqual('');
    expect(matcher.rest('')).toEqual('');
  });

  test('matches typical example', () => {
    const line = '  run script1 10 20 ';
    expect(matcher.test(line)).toBeTruthy();
    expect(matcher.firstRest(line)).toEqual(['run', 'script1 10 20']);
    expect(matcher.first(line)).toEqual('run');
    expect(matcher.rest(line)).toEqual('script1 10 20');
  });

  test("does not match if first doesn't match", () => {
    const line = '  ru.n script1 10 20';
    expect(matcher.test(line)).toBeFalsy();
    expect(matcher.firstRest(line)).toEqual(['', '']);
    expect(matcher.first(line)).toEqual('');
    expect(matcher.rest(line)).toEqual('');
  });

  test('matches empty padding', () => {
    const line = 'run abc ';
    expect(matcher.test(line)).toBeTruthy();
    expect(matcher.firstRest(line)).toEqual(['run', 'abc']);
    expect(matcher.first(line)).toEqual('run');
    expect(matcher.rest(line)).toEqual('abc');
  });

  test('matches an empty rest', () => {
    const line = ' run';
    expect(matcher.test(line)).toBeTruthy();
    expect(matcher.firstRest(line)).toEqual(['run', '']);
    expect(matcher.first(line)).toEqual('run');
    expect(matcher.rest(line)).toEqual('');
  });

  test('matches an empty rest & trailing spaces', () => {
    const line = '  run  ';
    expect(matcher.test(line)).toBeTruthy();
    expect(matcher.firstRest(line)).toEqual(['run', '']);
    expect(matcher.first(line)).toEqual('run');
    expect(matcher.rest(line)).toEqual('');
  });

  test('matches alternate construct', () => {
    const matcher = createFirstRestMatcher(/run|stop/);

    const lineRun = ' run script1 10 20';
    expect(matcher.test(lineRun)).toBeTruthy();
    expect(matcher.firstRest(lineRun)).toEqual(['run', 'script1 10 20']);
    expect(matcher.first(lineRun)).toEqual('run');
    expect(matcher.rest(lineRun)).toEqual('script1 10 20');

    const lineStop = 'stop script1 10 20 ';
    expect(matcher.test(lineStop)).toBeTruthy();
    expect(matcher.firstRest(lineStop)).toEqual(['stop', 'script1 10 20']);
    expect(matcher.first(lineStop)).toEqual('stop');
    expect(matcher.rest(lineStop)).toEqual('script1 10 20');

    const lineIdle = '  idle script1 10 20';
    expect(matcher.test(lineIdle)).toBeFalsy();
    expect(matcher.firstRest(lineIdle)).toEqual(['', '']);
    expect(matcher.first(lineIdle)).toEqual('');
    expect(matcher.rest(lineIdle)).toEqual('');
  });

  test('create matcher from string', () => {
    const idleMatcher = createFirstRestMatcher('idle');

    const lineIdle = '   idle script1 10 20  ';
    expect(idleMatcher.test(lineIdle)).toBeTruthy();
    expect(idleMatcher.firstRest(lineIdle)).toEqual(['idle', 'script1 10 20']);
    expect(idleMatcher.first(lineIdle)).toEqual('idle');
    expect(idleMatcher.rest(lineIdle)).toEqual('script1 10 20');

    const lineRun = '   run script1 10 20';
    expect(idleMatcher.test(lineRun)).toBeFalsy();
    expect(idleMatcher.firstRest(lineRun)).toEqual(['', '']);
    expect(idleMatcher.first(lineRun)).toEqual('');
    expect(idleMatcher.rest(lineRun)).toEqual('');
  });
});

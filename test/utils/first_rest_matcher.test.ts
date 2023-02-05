import {
  IFirstRestMatcher,
  createFirstRestMatcher,
} from '../../src/utils/first_rest_matcher';

let wordMatcher: IFirstRestMatcher;

beforeEach(() => {
  wordMatcher = createFirstRestMatcher(/\w+/);
});

describe('HeadTailMatcher', () => {
  test('does not match empty sample, returns empty strings', () => {
    expect(wordMatcher.test('')).toBeFalsy();
    expect(wordMatcher.firstRest('')).toEqual(['', '']);
    expect(wordMatcher.first('')).toEqual('');
    expect(wordMatcher.rest('')).toEqual('');
  });

  test('matches typical example', () => {
    const line = '  run script1 10 20 ';
    expect(wordMatcher.test(line)).toBeTruthy();
    expect(wordMatcher.firstRest(line)).toEqual(['run', ' script1 10 20 ']);
    expect(wordMatcher.first(line)).toEqual('run');
    expect(wordMatcher.rest(line)).toEqual(' script1 10 20 ');
  });

  test('tail is the rest of the original string', () => {
    const line = '  run a  ';
    expect(wordMatcher.test(line)).toBeTruthy();
    expect(wordMatcher.firstRest(line)).toEqual(['run', ' a  ']);
    expect(wordMatcher.first(line)).toEqual('run');
    expect(wordMatcher.rest(line)).toEqual(' a  ');
  });

  test("does not match if first doesn't match", () => {
    const line = '  ru.n script1 10 20 ';
    expect(wordMatcher.test(line)).toBeFalsy();
    expect(wordMatcher.firstRest(line)).toEqual(['', '']);
    expect(wordMatcher.first(line)).toEqual('');
    expect(wordMatcher.rest(line)).toEqual('');
  });

  test('matches an empty rest', () => {
    const line = ' run';
    expect(wordMatcher.test(line)).toBeTruthy();
    expect(wordMatcher.firstRest(line)).toEqual(['run', '']);
    expect(wordMatcher.first(line)).toEqual('run');
    expect(wordMatcher.rest(line)).toEqual('');
  });

  test('matches alternate construct', () => {
    const matcher = createFirstRestMatcher(/run|stop/);

    const lineRun = ' run script1 10 20';
    expect(matcher.test(lineRun)).toBeTruthy();
    expect(matcher.firstRest(lineRun)).toEqual(['run', ' script1 10 20']);
    expect(matcher.first(lineRun)).toEqual('run');
    expect(matcher.rest(lineRun)).toEqual(' script1 10 20');

    const lineStop = 'stop  script1 10 20 ';
    expect(matcher.test(lineStop)).toBeTruthy();
    expect(matcher.firstRest(lineStop)).toEqual(['stop', '  script1 10 20 ']);
    expect(matcher.first(lineStop)).toEqual('stop');
    expect(matcher.rest(lineStop)).toEqual('  script1 10 20 ');

    const lineIdle = '  idle script1 10 20';
    expect(matcher.test(lineIdle)).toBeFalsy();
    expect(matcher.firstRest(lineIdle)).toEqual(['', '']);
    expect(matcher.first(lineIdle)).toEqual('');
    expect(matcher.rest(lineIdle)).toEqual('');
  });

  test('create matcher from string', () => {
    const idleMatcher = createFirstRestMatcher('idle');

    const lineIdle = '   idle script1 10 20';
    expect(idleMatcher.test(lineIdle)).toBeTruthy();
    expect(idleMatcher.firstRest(lineIdle)).toEqual(['idle', ' script1 10 20']);
    expect(idleMatcher.first(lineIdle)).toEqual('idle');
    expect(idleMatcher.rest(lineIdle)).toEqual(' script1 10 20');

    const lineRun = '   run script1 10 20';
    expect(idleMatcher.test(lineRun)).toBeFalsy();
    expect(idleMatcher.firstRest(lineRun)).toEqual(['', '']);
    expect(idleMatcher.first(lineRun)).toEqual('');
    expect(idleMatcher.rest(lineRun)).toEqual('');
  });
});

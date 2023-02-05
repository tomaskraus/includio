import {IFirstMatcher, createFirstMatcher} from '../../src/utils/first_matcher';

let wordFirstMatcher: IFirstMatcher;

beforeEach(() => {
  wordFirstMatcher = createFirstMatcher(/\w+/);
});

describe('HeadTailMatcher', () => {
  test('does not match empty sample, returns empty strings', () => {
    expect(wordFirstMatcher.test('')).toBeFalsy();
    expect(wordFirstMatcher.headTail('')).toEqual(['', '']);
    expect(wordFirstMatcher.head('')).toEqual('');
    expect(wordFirstMatcher.tail('')).toEqual('');
  });

  test('matches typical example', () => {
    const line = '  run script1 10 20 ';
    expect(wordFirstMatcher.test(line)).toBeTruthy();
    expect(wordFirstMatcher.headTail(line)).toEqual(['run', ' script1 10 20 ']);
    expect(wordFirstMatcher.head(line)).toEqual('run');
    expect(wordFirstMatcher.tail(line)).toEqual(' script1 10 20 ');
  });

  test('tail is the rest of the original string', () => {
    const line = '  run a  ';
    expect(wordFirstMatcher.test(line)).toBeTruthy();
    expect(wordFirstMatcher.headTail(line)).toEqual(['run', ' a  ']);
    expect(wordFirstMatcher.head(line)).toEqual('run');
    expect(wordFirstMatcher.tail(line)).toEqual(' a  ');
  });

  test("does not match if first doesn't match", () => {
    const line = '  ru.n script1 10 20 ';
    expect(wordFirstMatcher.test(line)).toBeFalsy();
    expect(wordFirstMatcher.headTail(line)).toEqual(['', '']);
    expect(wordFirstMatcher.head(line)).toEqual('');
    expect(wordFirstMatcher.tail(line)).toEqual('');
  });

  test('matches an empty rest', () => {
    const line = ' run';
    expect(wordFirstMatcher.test(line)).toBeTruthy();
    expect(wordFirstMatcher.headTail(line)).toEqual(['run', '']);
    expect(wordFirstMatcher.head(line)).toEqual('run');
    expect(wordFirstMatcher.tail(line)).toEqual('');
  });

  test('matches alternate construct', () => {
    const matcher = createFirstMatcher(/run|stop/);

    const lineRun = ' run script1 10 20';
    expect(matcher.test(lineRun)).toBeTruthy();
    expect(matcher.headTail(lineRun)).toEqual(['run', ' script1 10 20']);
    expect(matcher.head(lineRun)).toEqual('run');
    expect(matcher.tail(lineRun)).toEqual(' script1 10 20');

    const lineStop = 'stop  script1 10 20 ';
    expect(matcher.test(lineStop)).toBeTruthy();
    expect(matcher.headTail(lineStop)).toEqual(['stop', '  script1 10 20 ']);
    expect(matcher.head(lineStop)).toEqual('stop');
    expect(matcher.tail(lineStop)).toEqual('  script1 10 20 ');

    const lineIdle = '  idle script1 10 20';
    expect(matcher.test(lineIdle)).toBeFalsy();
    expect(matcher.headTail(lineIdle)).toEqual(['', '']);
    expect(matcher.head(lineIdle)).toEqual('');
    expect(matcher.tail(lineIdle)).toEqual('');
  });

  test('create matcher from string', () => {
    const idleMatcher = createFirstMatcher('idle');

    const lineIdle = '   idle script1 10 20';
    expect(idleMatcher.test(lineIdle)).toBeTruthy();
    expect(idleMatcher.headTail(lineIdle)).toEqual(['idle', ' script1 10 20']);
    expect(idleMatcher.head(lineIdle)).toEqual('idle');
    expect(idleMatcher.tail(lineIdle)).toEqual(' script1 10 20');

    const lineRun = '   run script1 10 20';
    expect(idleMatcher.test(lineRun)).toBeFalsy();
    expect(idleMatcher.headTail(lineRun)).toEqual(['', '']);
    expect(idleMatcher.head(lineRun)).toEqual('');
    expect(idleMatcher.tail(lineRun)).toEqual('');
  });
});

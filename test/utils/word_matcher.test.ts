import {IWordMatcher, createWordMatcher} from '../../src/utils/word_matcher';

let matcher: IWordMatcher;

beforeEach(() => {
  matcher = createWordMatcher(/\w+/);
});

describe('WordMatcher', () => {
  test('does not match empty sample, returns empty strings', () => {
    expect(matcher.test('')).toBeFalsy();
    expect(matcher.word('')).toEqual('');
  });

  test('matches typical example', () => {
    const line = '  run  ';
    expect(matcher.test(line)).toBeTruthy();
    expect(matcher.word(line)).toEqual('run');
  });

  test("does not match if word doesn't match", () => {
    const line = '  ru.n ';
    expect(matcher.test(line)).toBeFalsy();
    expect(matcher.word(line)).toEqual('');
  });

  test('does not match more words', () => {
    const line = '  run quick ';
    expect(matcher.test(line)).toBeFalsy();
    expect(matcher.word(line)).toEqual('');
  });

  test('matches empty padding', () => {
    const line = 'run ';
    expect(matcher.test(line)).toBeTruthy();
    expect(matcher.word(line)).toEqual('run');
  });

  test('template overrides space matching', () => {
    const strictMatcher = createWordMatcher(/^[\w]+$/);

    const line = 'run';
    expect(strictMatcher.test(line)).toBeTruthy();
    expect(strictMatcher.word(line)).toEqual('run');

    const line2 = ' run';
    expect(strictMatcher.test(line2)).toBeFalsy();
    expect(strictMatcher.word(line2)).toEqual('');
  });

  test('matches an empty tail', () => {
    const line = ' run';
    expect(matcher.test(line)).toBeTruthy();
    expect(matcher.word(line)).toEqual('run');
  });

  test('matches no heading and trailing spaces', () => {
    const line = 'run';
    expect(matcher.test(line)).toBeTruthy();
    expect(matcher.word(line)).toEqual('run');
  });

  test('matches alternate construct', () => {
    const matcher = createWordMatcher(/run|stop/);

    const lineRun = ' run ';
    expect(matcher.test(lineRun)).toBeTruthy();
    expect(matcher.word(lineRun)).toEqual('run');

    const lineStop = 'stop  ';
    expect(matcher.test(lineStop)).toBeTruthy();
    expect(matcher.word(lineStop)).toEqual('stop');

    const lineIdle = '  idle ';
    expect(matcher.test(lineIdle)).toBeFalsy();
    expect(matcher.word(lineIdle)).toEqual('');
  });

  test('create matcher from string', () => {
    const idleMatcher = createWordMatcher('idle');

    const lineIdle = '   idle   ';
    expect(idleMatcher.test(lineIdle)).toBeTruthy();
    expect(idleMatcher.word(lineIdle)).toEqual('idle');

    const lineRun = '   run ';
    expect(idleMatcher.test(lineRun)).toBeFalsy();
    expect(idleMatcher.word(lineRun)).toEqual('');
  });
});

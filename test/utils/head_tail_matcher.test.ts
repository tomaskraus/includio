import {
  IHeadTailMatcher,
  createHeadTailMatcher,
} from '../../src/utils/head_tail_matcher';

let matcher: IHeadTailMatcher;

beforeEach(() => {
  matcher = createHeadTailMatcher(/\w+/);
});

describe('HeadTailMatcher', () => {
  test('does not match empty sample, returns empty strings', () => {
    expect(matcher.test('')).toBeFalsy();
    expect(matcher.headTail('')).toEqual(['', '']);
    expect(matcher.head('')).toEqual('');
    expect(matcher.tail('')).toEqual('');
    expect(matcher.leftPadding('')).toEqual('');
  });

  test('matches typical example', () => {
    const line = '  run script1 10 20 ';
    expect(matcher.test(line)).toBeTruthy();
    expect(matcher.headTail(line)).toEqual(['run', 'script1 10 20']);
    expect(matcher.head(line)).toEqual('run');
    expect(matcher.tail(line)).toEqual('script1 10 20');
    expect(matcher.leftPadding(line)).toEqual('  ');
  });

  test("does not match if head doesn't match", () => {
    const line = '  ru.n script1 10 20';
    expect(matcher.test(line)).toBeFalsy();
    expect(matcher.headTail(line)).toEqual(['', '']);
    expect(matcher.head(line)).toEqual('');
    expect(matcher.tail(line)).toEqual('');
    //does not preserve padding functionality
    expect(matcher.leftPadding(line)).toEqual('');
  });

  test('matches empty padding', () => {
    const line = 'run abc ';
    expect(matcher.test(line)).toBeTruthy();
    expect(matcher.headTail(line)).toEqual(['run', 'abc']);
    expect(matcher.head(line)).toEqual('run');
    expect(matcher.tail(line)).toEqual('abc');
    expect(matcher.leftPadding(line)).toEqual('');
  });

  test('matches an empty tail', () => {
    const line = ' run';
    expect(matcher.test(line)).toBeTruthy();
    expect(matcher.headTail(line)).toEqual(['run', '']);
    expect(matcher.head(line)).toEqual('run');
    expect(matcher.tail(line)).toEqual('');
    expect(matcher.leftPadding(line)).toEqual(' ');
  });

  test('matches an empty tail & trailing spaces', () => {
    const line = '  run  ';
    expect(matcher.test(line)).toBeTruthy();
    expect(matcher.headTail(line)).toEqual(['run', '']);
    expect(matcher.head(line)).toEqual('run');
    expect(matcher.tail(line)).toEqual('');
    expect(matcher.leftPadding(line)).toEqual('  ');
  });

  test('matches alternate construct', () => {
    const matcher = createHeadTailMatcher(/run|stop/);

    const lineRun = ' run script1 10 20';
    expect(matcher.test(lineRun)).toBeTruthy();
    expect(matcher.headTail(lineRun)).toEqual(['run', 'script1 10 20']);
    expect(matcher.head(lineRun)).toEqual('run');
    expect(matcher.tail(lineRun)).toEqual('script1 10 20');
    expect(matcher.leftPadding(lineRun)).toEqual(' ');

    const lineStop = 'stop script1 10 20 ';
    expect(matcher.test(lineStop)).toBeTruthy();
    expect(matcher.headTail(lineStop)).toEqual(['stop', 'script1 10 20']);
    expect(matcher.head(lineStop)).toEqual('stop');
    expect(matcher.tail(lineStop)).toEqual('script1 10 20');
    expect(matcher.leftPadding(lineStop)).toEqual('');

    const lineIdle = '  idle script1 10 20';
    expect(matcher.test(lineIdle)).toBeFalsy();
    expect(matcher.headTail(lineIdle)).toEqual(['', '']);
    expect(matcher.head(lineIdle)).toEqual('');
    expect(matcher.tail(lineIdle)).toEqual('');
    expect(matcher.leftPadding(lineIdle)).toEqual('');
  });

  test('create matcher from string', () => {
    const idleMatcher = createHeadTailMatcher('idle');

    const lineIdle = '   idle script1 10 20  ';
    expect(idleMatcher.test(lineIdle)).toBeTruthy();
    expect(idleMatcher.headTail(lineIdle)).toEqual(['idle', 'script1 10 20']);
    expect(idleMatcher.head(lineIdle)).toEqual('idle');
    expect(idleMatcher.tail(lineIdle)).toEqual('script1 10 20');
    expect(idleMatcher.leftPadding(lineIdle)).toEqual('   ');

    const lineRun = '   run script1 10 20';
    expect(idleMatcher.test(lineRun)).toBeFalsy();
    expect(idleMatcher.headTail(lineRun)).toEqual(['', '']);
    expect(idleMatcher.head(lineRun)).toEqual('');
    expect(idleMatcher.tail(lineRun)).toEqual('');
    expect(idleMatcher.leftPadding(lineRun)).toEqual('');
  });
});

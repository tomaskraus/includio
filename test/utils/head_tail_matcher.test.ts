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
    expect(matcher.head('')).toEqual('');
    expect(matcher.tail('')).toEqual('');
    expect(matcher.leftPadding('')).toEqual('');
  });

  test('matches typical example', () => {
    const line = '  run script1 10 20 ';
    expect(matcher.test(line)).toBeTruthy();
    expect(matcher.head(line)).toEqual('run');
    expect(matcher.tail(line)).toEqual('script1 10 20');
    expect(matcher.leftPadding(line)).toEqual('  ');
  });

  test("does not match if head doesn't match", () => {
    const line = '  ru.n script1 10 20';
    expect(matcher.test(line)).toBeFalsy();
    expect(matcher.head(line)).toEqual('');
    expect(matcher.tail(line)).toEqual('');
    //does not preserve padding functionality
    expect(matcher.leftPadding(line)).toEqual('');
  });

  test('matches empty padding', () => {
    const line = 'run abc ';
    expect(matcher.test(line)).toBeTruthy();
    expect(matcher.head(line)).toEqual('run');
    expect(matcher.tail(line)).toEqual('abc');
    expect(matcher.leftPadding(line)).toEqual('');
  });

  test('matches an empty tail', () => {
    const line = ' run';
    expect(matcher.test(line)).toBeTruthy();
    expect(matcher.head(line)).toEqual('run');
    expect(matcher.tail(line)).toEqual('');
    expect(matcher.leftPadding(line)).toEqual(' ');
  });

  test('matches alternate construct', () => {
    const matcher = createHeadTailMatcher(/run|stop/);

    const lineRun = ' run script1 10 20';
    expect(matcher.test(lineRun)).toBeTruthy();
    expect(matcher.head(lineRun)).toEqual('run');
    expect(matcher.tail(lineRun)).toEqual('script1 10 20');
    expect(matcher.leftPadding(lineRun)).toEqual(' ');

    const lineStop = 'stop script1 10 20 ';
    expect(matcher.test(lineStop)).toBeTruthy();
    expect(matcher.head(lineStop)).toEqual('stop');
    expect(matcher.tail(lineStop)).toEqual('script1 10 20');
    expect(matcher.leftPadding(lineStop)).toEqual('');

    const lineIdle = '  idle script1 10 20';
    expect(matcher.test(lineIdle)).toBeFalsy();
    expect(matcher.head(lineIdle)).toEqual('');
    expect(matcher.tail(lineIdle)).toEqual('');
    expect(matcher.leftPadding(lineIdle)).toEqual('');
  });

  test('create matcher from string', () => {
    const matcher = createHeadTailMatcher('idle');

    const lineRun = '   idle script1 10 20  ';
    expect(matcher.test(lineRun)).toBeTruthy();
    expect(matcher.head(lineRun)).toEqual('idle');
    expect(matcher.tail(lineRun)).toEqual('script1 10 20');
    expect(matcher.leftPadding(lineRun)).toEqual('   ');

    const lineIdle = '   run script1 10 20';
    expect(matcher.test(lineIdle)).toBeFalsy();
    expect(matcher.head(lineIdle)).toEqual('');
    expect(matcher.tail(lineIdle)).toEqual('');
    expect(matcher.leftPadding(lineIdle)).toEqual('');
  });
});

import {
  IFirstAndRestMatcher,
  createFirstAndRestMatcher,
} from '../../src/utils/first_and_rest_matcher';

let matcher: IFirstAndRestMatcher;

beforeEach(() => {
  matcher = createFirstAndRestMatcher(/\w+/);
});

describe('firstAndRestMatcher', () => {
  test('does not match empty sample, returns empty strings', () => {
    expect(matcher.test('')).toBeFalsy();
    expect(matcher.first('')).toEqual('');
    expect(matcher.rest('')).toEqual('');
    expect(matcher.leftPadding('')).toEqual('');
  });

  test('matches typical example', () => {
    const line = '  run script1 10 20 ';
    expect(matcher.test(line)).toBeTruthy();
    expect(matcher.first(line)).toEqual('run');
    expect(matcher.rest(line)).toEqual('script1 10 20');
    expect(matcher.leftPadding(line)).toEqual('  ');
  });

  test("does not match if first doesn't match", () => {
    const line = '  ru.n script1 10 20';
    expect(matcher.test(line)).toBeFalsy();
    expect(matcher.first(line)).toEqual('');
    expect(matcher.rest(line)).toEqual('');
    //does not preserve padding functionality
    expect(matcher.leftPadding(line)).toEqual('');
  });

  test('matches empty padding', () => {
    const line = 'run abc ';
    expect(matcher.test(line)).toBeTruthy();
    expect(matcher.first(line)).toEqual('run');
    expect(matcher.rest(line)).toEqual('abc');
    expect(matcher.leftPadding(line)).toEqual('');
  });

  test('matches empty rest', () => {
    const line = ' run';
    expect(matcher.test(line)).toBeTruthy();
    expect(matcher.first(line)).toEqual('run');
    expect(matcher.rest(line)).toEqual('');
    expect(matcher.leftPadding(line)).toEqual(' ');
  });

  test('matches alternate construct', () => {
    const matcher = createFirstAndRestMatcher(/run|stop/);

    const lineRun = ' run script1 10 20';
    expect(matcher.test(lineRun)).toBeTruthy();
    expect(matcher.first(lineRun)).toEqual('run');
    expect(matcher.rest(lineRun)).toEqual('script1 10 20');
    expect(matcher.leftPadding(lineRun)).toEqual(' ');

    const lineStop = 'stop script1 10 20 ';
    expect(matcher.test(lineStop)).toBeTruthy();
    expect(matcher.first(lineStop)).toEqual('stop');
    expect(matcher.rest(lineStop)).toEqual('script1 10 20');
    expect(matcher.leftPadding(lineStop)).toEqual('');

    const lineIdle = '  idle script1 10 20';
    expect(matcher.test(lineIdle)).toBeFalsy();
    expect(matcher.first(lineIdle)).toEqual('');
    expect(matcher.rest(lineIdle)).toEqual('');
    expect(matcher.leftPadding(lineIdle)).toEqual('');
  });

  test('create matcher from string', () => {
    const matcher = createFirstAndRestMatcher('idle');

    const lineRun = '   idle script1 10 20  ';
    expect(matcher.test(lineRun)).toBeTruthy();
    expect(matcher.first(lineRun)).toEqual('idle');
    expect(matcher.rest(lineRun)).toEqual('script1 10 20');
    expect(matcher.leftPadding(lineRun)).toEqual('   ');

    const lineIdle = '   run script1 10 20';
    expect(matcher.test(lineIdle)).toBeFalsy();
    expect(matcher.first(lineIdle)).toEqual('');
    expect(matcher.rest(lineIdle)).toEqual('');
    expect(matcher.leftPadding(lineIdle)).toEqual('');
  });

  //   test('matches group construct', () => {
  //
  //     // Returns unexpected results!
  //
  //     const matcher = createFirstAndRestMatcher(/([\w\\.])+|"([\w\\. ]+)"/);
  //     const line = ' abc.txt script1 10 20  ';
  //     expect(matcher.test(line)).toBeTruthy();
  //     expect(matcher.first(line)).toEqual('abc.txt');
  //     expect(matcher.rest(line)).toEqual('script1 10 20');
  //     expect(matcher.leftPadding(line)).toEqual(' ');

  //     const line2 = '  "a b c.txt" script1 10 20 ';
  //     expect(matcher.test(line2)).toBeTruthy();
  //     expect(matcher.first(line2)).toEqual('run');
  //     expect(matcher.rest(line2)).toEqual('script1 10 20');
  //     expect(matcher.leftPadding(line2)).toEqual('  ');
  //   });
});

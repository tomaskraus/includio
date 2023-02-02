"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const word_matcher_1 = require("../../src/utils/word_matcher");
let matcher;
beforeEach(() => {
    matcher = (0, word_matcher_1.createWordMatcher)(/\w+/);
});
describe('WordMatcher', () => {
    test('does not match empty sample, returns empty strings', () => {
        expect(matcher.test('')).toBeFalsy();
        expect(matcher.value('')).toEqual('');
    });
    test('matches typical example', () => {
        const line = '  run  ';
        expect(matcher.test(line)).toBeTruthy();
        expect(matcher.value(line)).toEqual('run');
    });
    test("does not match if word doesn't match", () => {
        const line = '  ru.n ';
        expect(matcher.test(line)).toBeFalsy();
        expect(matcher.value(line)).toEqual('');
    });
    test('does not match more words', () => {
        const line = '  run quick ';
        expect(matcher.test(line)).toBeFalsy();
        expect(matcher.value(line)).toEqual('');
    });
    test('matches empty padding', () => {
        const line = 'run ';
        expect(matcher.test(line)).toBeTruthy();
        expect(matcher.value(line)).toEqual('run');
    });
    test('template overrides space matching', () => {
        const strictMatcher = (0, word_matcher_1.createWordMatcher)(/^[\w]+$/);
        const line = 'run';
        expect(strictMatcher.test(line)).toBeTruthy();
        expect(strictMatcher.value(line)).toEqual('run');
        const line2 = ' run';
        expect(strictMatcher.test(line2)).toBeFalsy();
        expect(strictMatcher.value(line2)).toEqual('');
    });
    test('matches an empty tail', () => {
        const line = ' run';
        expect(matcher.test(line)).toBeTruthy();
        expect(matcher.value(line)).toEqual('run');
    });
    test('matches no heading and trailing spaces', () => {
        const line = 'run';
        expect(matcher.test(line)).toBeTruthy();
        expect(matcher.value(line)).toEqual('run');
    });
    test('matches alternate construct', () => {
        const matcher = (0, word_matcher_1.createWordMatcher)(/run|stop/);
        const lineRun = ' run ';
        expect(matcher.test(lineRun)).toBeTruthy();
        expect(matcher.value(lineRun)).toEqual('run');
        const lineStop = 'stop  ';
        expect(matcher.test(lineStop)).toBeTruthy();
        expect(matcher.value(lineStop)).toEqual('stop');
        const lineIdle = '  idle ';
        expect(matcher.test(lineIdle)).toBeFalsy();
        expect(matcher.value(lineIdle)).toEqual('');
    });
    test('create matcher from string', () => {
        const idleMatcher = (0, word_matcher_1.createWordMatcher)('idle');
        const lineIdle = '   idle   ';
        expect(idleMatcher.test(lineIdle)).toBeTruthy();
        expect(idleMatcher.value(lineIdle)).toEqual('idle');
        const lineRun = '   run ';
        expect(idleMatcher.test(lineRun)).toBeFalsy();
        expect(idleMatcher.value(lineRun)).toEqual('');
    });
});
//# sourceMappingURL=word_matcher.test.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWordMatcher = void 0;
/**
   * RegExp special helper
   * tests & matches if line contains one word
   *
   * Its word method is safe: returns empty string if does not match.
   *
   * @example
     ```ts
    const machineCmdWordMatcher = createWordMatcher(/run|stop/);

    machineCmdWordMatcher.test('  run ') === true;
    machineCmdWordMatcher.value('  run ') === 'run'; // trims the result

    machineCmdWordMatcher.test('stop') === true;
    machineCmdWordMatcher.value('stop') === 'stop';

    machineCmdWordMatcher.test(' run1 ') === false;
    machineCmdWordMatcher.value('  run1 ') === '';
    assert.throws(() => machineCmdWordMatcher.parse('  run1 '));

    machineCmdWordMatcher.test(' run a ') === false;
    machineCmdWordMatcher.value('  run a ') === '';
    assert.throws(() => machineCmdWordMatcher.parse('  run a ', 'Machine command')); // can include custom error message beginning
      ```

   * Limitations:
   * Do not use group construct in the RegExp parameter. WordMatcher may return unexpected results.
   *
   */
const createWordMatcher = (word) => {
    const wordValue = typeof word === 'string' ? word : word.source;
    const matcherRegexp = new RegExp(`^\\s*(${wordValue})\\s*$`);
    const safeMatches = ['', ''];
    const getValue = (s) => {
        const matches = s.match(matcherRegexp) || safeMatches;
        return (matches[1] || '').trim();
    };
    const parse = (s, name = 'Value') => {
        if (!matcherRegexp.test(s)) {
            throw new Error(`${name}: invalid value format: (${s})`);
        }
        return getValue(s);
    };
    return {
        test: (s) => matcherRegexp.test(s),
        value: getValue,
        parse: parse,
    };
};
exports.createWordMatcher = createWordMatcher;
//# sourceMappingURL=word_matcher.js.map
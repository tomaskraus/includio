export interface IWordMatcher {
  test: (s: string) => boolean;
  value: (s: string) => string;
  parse: (s: string, name?: string) => string;
}

/**
   * RegExp special helper
   * tests & matches if line contains one word
   *
   * Its word method is safe: returns empty string if does not match.
   *
   * @example
     ```ts
      const runStopMatcher = createWordMatcher(/run|stop/);

      runStopMatcher.test('  run ') === true;
      runStopMatcher.value('  run ') === 'run';  //trims the result

      runStopMatcher.test('stop') === true;
      runStopMatcher.value('stop') === 'stop';

      runStopMatcher.test(' run1 ') === false;
      runStopMatcher.value('  run1 ') === '';
      assert.throws(() => runStopMatcher.parse('  run1 '));

      runStopMatcher.test(' run a ') === false;
      runStopMatcher.value('  run a ') === '';
      assert.throws(() => runStopMatcher.parse('  run a '));
      ```

   * Limitations:
   * Do not use group construct in the RegExp parameter. WordMatcher may return unexpected results.
   *
   */
export const createWordMatcher = (word: RegExp | string): IWordMatcher => {
  const wordValue = typeof word === 'string' ? word : word.source;
  const matcherRegexp = new RegExp(`^\\s*(${wordValue})\\s*$`);
  const safeMatches = ['', ''];

  const getValue = (s: string): string => {
    const matches = s.match(matcherRegexp) || safeMatches;
    return (matches[1] || '').trim();
  };

  const parse = (s: string, name = 'Value') => {
    if (!matcherRegexp.test(s)) {
      throw new Error(`${name}: invalid value format: (${s})`);
    }
    return getValue(s);
  };

  return {
    test: (s: string) => matcherRegexp.test(s),
    value: getValue,
    parse: parse,
  };
};

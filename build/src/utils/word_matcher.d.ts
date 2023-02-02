export interface IWordMatcher {
    test: (s: string) => boolean;
    word: (s: string) => string;
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
      runStopMatcher.word('  run ') === 'run';  //trims the result

      runStopMatcher.test('stop') === true;
      runStopMatcher.word('stop') === 'stop';

      runStopMatcher.test(' run1 ') === false;
      runStopMatcher.word('  run1 ') === '';

      runStopMatcher.test(' run a ') === false;
      runStopMatcher.word('  run a ') === '';

      ```

   * Limitations:
   * Do not use group construct in the RegExp parameter. WordMatcher may return unexpected results.
   *
   */
export declare const createWordMatcher: (word: RegExp | string) => IWordMatcher;

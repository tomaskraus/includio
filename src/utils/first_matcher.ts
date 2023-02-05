export interface IFirstMatcher {
  test: (s: string) => boolean;
  headTail: (s: string) => [string, string];
  head: (s: string) => string;
  tail: (s: string) => string;
}

/**
 * RegExp special helper
 * For a given line, provides functions to recognize its two parts:
 * '(head)(tail)'
 * where:
 *  - (head) is customizable (RegExp|String argument), trimmed automatically.
 *  - (tail) is the rest of the line till its end, not trimmed.
 *
 *
 * @example
   ```ts
    const runStopMatcher = createFirstMatcher(/run|stop/);

    runStopMatcher.test('  run  script1 10 20 ') === true;
    runStopMatcher.headTail('  run  script1 10 20 '); //=> ['run', '  script1 10 20 '];
    runStopMatcher.head('  run  script1 10 20 ') === 'run';
    runStopMatcher.tail('  run  script1 10 20 ') === '  script1 10 20 ';

    runStopMatcher.test('stop') === true;
    runStopMatcher.headTail('stop'); //=> ['stop', ''];
    runStopMatcher.head('stop') === 'stop';
    runStopMatcher.tail('stop') === '';

    runStopMatcher.test(' something else ') === false;
    runStopMatcher.headTail(' something else '); //=> ['', ''];
    runStopMatcher.head(' something else ') === '';
    runStopMatcher.tail(' something else ') === '';
    ```
 *
 *
 * (head) and (tail) are safe: return always a string, never null or undefined
 *
 * Tip: use ^ at the start of the regexp argument, to prevent FirstRestMatcher to recognize lines starting with white character(s)
 *
 * Limitations:
 * Do not use group construct in the (head) RegExp parameter. FirstRestMatcher may return unexpected results.
 *
 */

export const createFirstMatcher = (head: RegExp | string): IFirstMatcher => {
  const headValue = typeof head === 'string' ? head : head.source;
  const matcherRegexp = new RegExp(
    `^(\\s*)(${headValue})$|^(\\s*)(${headValue})(\\s+.*)$`
  );
  const safeMatches = ['', '', '', '', '', '', ''];
  const headTail = (s: string): [string, string] => {
    const matches = s.match(matcherRegexp) || safeMatches;
    return [(matches[2] || matches[4] || '').trim(), matches[5] || ''];
  };
  return {
    test: (s: string) => matcherRegexp.test(s),
    headTail,
    head: (s: string) => headTail(s)[0],
    tail: (s: string) => headTail(s)[1],
  };
};

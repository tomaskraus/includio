import {defaultIfNullOrUndefined} from './default_value';

export interface IHeadTailMatcher {
  test: (s: string) => boolean;
  head: (s: string) => string;
  tail: (s: string) => string;
  leftPadding: (s: string) => string;
}

/**
 * RegExp special helper
 * For a given line, provides functions to recognize its three parts:
 * '(padding)(head)(tail)'
 * where:
 *  - (padding) consists of white characters
 *  - (head) is customizable (RegExp/String argument)
 *  - (tail) is the rest of the line till its end, trimmed
 *
 *
 * @example
   ```ts
    const runStopMatcher = createHeadTailMatcher(/run|stop/);

    runStopMatcher.test('  run script1 10 20 ') === true;
    runStopMatcher.head('  run script1 10 20 ') === 'run';
    runStopMatcher.tail('  run script1 10 20 ') === 'script1 10 20';
    runStopMatcher.leftPadding('  run script1 10 20 ') === '  ';

    runStopMatcher.test('stop') === true;
    runStopMatcher.head('stop') === 'stop';
    runStopMatcher.tail('stop') === '';
    runStopMatcher.leftPadding('stop') === '';

    runStopMatcher.test(' something else ') === false;
    runStopMatcher.head(' something else ') === '';
    runStopMatcher.tail(' something else ') === '';
    runStopMatcher.leftPadding(' something else ') === '';
    ```
 *
 *
 * (padding), (head) and (tail) are safe: return always a string, never null or undefined
 *
 * Tip: use ^ at the start of the regexp argument, to prevent FirstAndRestMatcher to recognize lines starting with white character(s)
 *
 * Limitations:
 * Do not use group construct in the (head) RegExp parameter. FirstAndRestMatcher may return unexpected results.
 *
 */
export const createHeadTailMatcher = (
  head: RegExp | string
): IHeadTailMatcher => {
  const headValue = typeof head === 'string' ? head : head.source;
  const matcherRegexp = new RegExp(
    `^(\\s*)(${headValue})$|^(\\s*)(${headValue})\\s+(.*)$`
  );
  const defaultMatches = ['', '', '', '', '', '', ''];
  return {
    test: (s: string) => matcherRegexp.test(s),
    head: (s: string) => {
      const matches = defaultIfNullOrUndefined(defaultMatches)(
        s.match(matcherRegexp)
      );
      return defaultIfNullOrUndefined('')(matches[2] || matches[4]).trim();
    },
    tail: (s: string) => {
      const matches = defaultIfNullOrUndefined(defaultMatches)(
        s.match(matcherRegexp)
      );
      return defaultIfNullOrUndefined('')(matches[5]).trim();
    },
    leftPadding: (s: string) => {
      const matches = defaultIfNullOrUndefined(defaultMatches)(
        s.match(matcherRegexp)
      );
      return defaultIfNullOrUndefined('')(matches[1] || matches[3]);
    },
  };
};

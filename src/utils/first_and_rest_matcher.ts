/**
 * RegExp special helper
 * Matches the typical line command string structure:
 * '<padding><first><rest>'
 * where:
 *  - <padding> consist of white characters
 *  - <first> is customizable
 *  - <rest> is the rest of line till its end
 *
 *
 * example:
 *  const line = '  run script1 10 20 ':
 *  const matcher = createFirstAndRestMatcher(line)
 *
 *  matcher.test(line) === true
 *  matcher.first(line) === 'run'
 *  matcher.rest(line) === 'script1 10 20'
 *  matcher.leftPadding(line) === '  '
 *
 * padding, first and rest are safe: return always a string, never null or undefined
 *
 *
 * Limitations:
 * Do not use group construct in the <first> RegExp parameter. FirstAndRestMatcher may return unexpected results.
 *
 */

import {defaultIfNullOrUndefined} from './default_value';

export interface IFirstAndRestMatcher {
  test: (s: string) => boolean;
  first: (s: string) => string;
  rest: (s: string) => string;
  leftPadding: (s: string) => string;
}

export const createFirstAndRestMatcher = (
  first: RegExp
): IFirstAndRestMatcher => {
  const matcherRegexp = new RegExp(
    `^(\\s*)(${first.source})$|^(\\s*)(${first.source})\\s+(.*)$`
  );
  const defaultMatches = ['', '', '', '', '', '', ''];
  return {
    test: (s: string) => matcherRegexp.test(s),
    first: (s: string) => {
      const matches = defaultIfNullOrUndefined(defaultMatches)(
        s.match(matcherRegexp)
      );
      return defaultIfNullOrUndefined('')(matches[2] || matches[4]).trim();
    },
    rest: (s: string) => {
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

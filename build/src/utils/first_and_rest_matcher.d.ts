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
export interface IFirstAndRestMatcher {
    test: (s: string) => boolean;
    first: (s: string) => string;
    rest: (s: string) => string;
    leftPadding: (s: string) => string;
}
export declare const createFirstAndRestMatcher: (first: RegExp | string) => IFirstAndRestMatcher;

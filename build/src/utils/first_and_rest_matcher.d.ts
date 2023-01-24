export interface IFirstAndRestMatcher {
    test: (s: string) => boolean;
    first: (s: string) => string;
    rest: (s: string) => string;
    leftPadding: (s: string) => string;
}
/**
 * RegExp special helper
 * For a given line, provides functions to recognize its three parts:
 * '(padding)(first)(rest)'
 * where:
 *  - (padding) consists of white characters
 *  - (first) is customizable (RegExp/String argument)
 *  - (rest) is the rest of the line till its end, trimmed
 *
 *
 * @example
   ```ts
    const runStopMatcher = createFirstAndRestMatcher(/run|stop/);

    runStopMatcher.test('  run script1 10 20 ') === true;
    runStopMatcher.first('  run script1 10 20 ') === 'run';
    runStopMatcher.rest('  run script1 10 20 ') === 'script1 10 20';
    runStopMatcher.leftPadding('  run script1 10 20 ') === '  ';

    runStopMatcher.test('stop') === true;
    runStopMatcher.first('stop') === 'stop';
    runStopMatcher.rest('stop') === '';
    runStopMatcher.leftPadding('stop') === '';

    runStopMatcher.test(' something else ') === false;
    runStopMatcher.first(' something else ') === '';
    runStopMatcher.rest(' something else ') === '';
    runStopMatcher.leftPadding(' something else ') === '';every
    ```
 *
 *
 * (padding), (first) and (rest) are safe: return always a string, never null or undefined
 *
 * Tip: use ^ at the start of the regexp argument, to prevent FirstAndRestMatcher to recognize lines starting with white character(s)
 *
 * Limitations:
 * Do not use group construct in the (first) RegExp parameter. FirstAndRestMatcher may return unexpected results.
 *
 */
export declare const createFirstAndRestMatcher: (first: RegExp | string) => IFirstAndRestMatcher;

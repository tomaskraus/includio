export interface IFirstRestMatcher {
    test: (s: string) => boolean;
    firstRest: (s: string) => [string, string];
    first: (s: string) => string;
    rest: (s: string) => string;
}
/**
 * RegExp special helper
 * For a given line, provides functions to recognize its two parts:
 * '(first)(rest)'
 * where:
 *  - (first) is customizable (RegExp/String argument)
 *  - (rest) is the rest of the line till its end, trimmed
 *
 *
 * @example
   ```ts
    const runStopMatcher = createFirstRestMatcher(/run|stop/);

    runStopMatcher.test('  run script1 10 20 ') === true;
    runStopMatcher.firstRest('  run script1 10 20 '); //=> ['run', 'script1 10 20'];
    runStopMatcher.first('  run script1 10 20 ') === 'run';
    runStopMatcher.rest('  run script1 10 20 ') === 'script1 10 20';

    runStopMatcher.test('stop') === true;
    runStopMatcher.firstRest('stop'); //=> ['stop', ''];
    runStopMatcher.first('stop') === 'stop';
    runStopMatcher.rest('stop') === '';

    runStopMatcher.test(' something else ') === false;
    runStopMatcher.firstRest(' something else '); //=> ['', ''];
    runStopMatcher.first(' something else ') === '';
    runStopMatcher.rest(' something else ') === '';
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
export declare const createFirstRestMatcher: (head: RegExp | string) => IFirstRestMatcher;

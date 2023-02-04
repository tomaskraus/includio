export interface IHeadTailMatcherOld {
    test: (s: string) => boolean;
    headTail: (s: string) => [string, string];
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
    runStopMatcher.headTail('  run script1 10 20 ') === ['run', 'script1 10 20'];
    runStopMatcher.head('  run script1 10 20 ') === 'run';
    runStopMatcher.tail('  run script1 10 20 ') === 'script1 10 20';
    runStopMatcher.leftPadding('  run script1 10 20 ') === '  ';

    runStopMatcher.test('stop') === true;
    runStopMatcher.headTail('stop') === ['stop', ''];
    runStopMatcher.head('stop') === 'stop';
    runStopMatcher.tail('stop') === '';
    runStopMatcher.leftPadding('stop') === '';

    runStopMatcher.test(' something else ') === false;
    runStopMatcher.headTail(' something else ') === ['', ''];
    runStopMatcher.head(' something else ') === '';
    runStopMatcher.tail(' something else ') === '';
    runStopMatcher.leftPadding(' something else ') === '';
    ```
 *
 *
 * (padding), (head) and (tail) are safe: return always a string, never null or undefined
 *
 * Tip: use ^ at the start of the regexp argument, to prevent HeadTailMatcher to recognize lines starting with white character(s)
 *
 * Limitations:
 * Do not use group construct in the (head) RegExp parameter. HeadTailMatcher may return unexpected results.
 *
 */
export declare const createHeadTailMatcherOld: (head: RegExp | string) => IHeadTailMatcherOld;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHeadTailMatcher = void 0;
const default_value_1 = require("./default_value");
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
const createHeadTailMatcher = (head) => {
    const headValue = typeof head === 'string' ? head : head.source;
    const matcherRegexp = new RegExp(`^(\\s*)(${headValue})$|^(\\s*)(${headValue})\\s+(.*)$`);
    const defaultMatches = ['', '', '', '', '', '', ''];
    return {
        test: (s) => matcherRegexp.test(s),
        head: (s) => {
            const matches = (0, default_value_1.defaultIfNullOrUndefined)(defaultMatches)(s.match(matcherRegexp));
            return (0, default_value_1.defaultIfNullOrUndefined)('')(matches[2] || matches[4]).trim();
        },
        tail: (s) => {
            const matches = (0, default_value_1.defaultIfNullOrUndefined)(defaultMatches)(s.match(matcherRegexp));
            return (0, default_value_1.defaultIfNullOrUndefined)('')(matches[5]).trim();
        },
        leftPadding: (s) => {
            const matches = (0, default_value_1.defaultIfNullOrUndefined)(defaultMatches)(s.match(matcherRegexp));
            return (0, default_value_1.defaultIfNullOrUndefined)('')(matches[1] || matches[3]);
        },
    };
};
exports.createHeadTailMatcher = createHeadTailMatcher;
//# sourceMappingURL=head_tail_matcher.js.map
"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFirstAndRestMatcher = void 0;
const default_value_1 = require("./default_value");
const createFirstAndRestMatcher = (first) => {
    const firstValue = typeof first === 'string' ? first : first.source;
    const matcherRegexp = new RegExp(`^(\\s*)(${firstValue})$|^(\\s*)(${firstValue})\\s+(.*)$`);
    const defaultMatches = ['', '', '', '', '', '', ''];
    return {
        test: (s) => matcherRegexp.test(s),
        first: (s) => {
            const matches = (0, default_value_1.defaultIfNullOrUndefined)(defaultMatches)(s.match(matcherRegexp));
            return (0, default_value_1.defaultIfNullOrUndefined)('')(matches[2] || matches[4]).trim();
        },
        rest: (s) => {
            const matches = (0, default_value_1.defaultIfNullOrUndefined)(defaultMatches)(s.match(matcherRegexp));
            return (0, default_value_1.defaultIfNullOrUndefined)('')(matches[5]).trim();
        },
        leftPadding: (s) => {
            const matches = (0, default_value_1.defaultIfNullOrUndefined)(defaultMatches)(s.match(matcherRegexp));
            return (0, default_value_1.defaultIfNullOrUndefined)('')(matches[1] || matches[3]);
        },
    };
};
exports.createFirstAndRestMatcher = createFirstAndRestMatcher;
//# sourceMappingURL=first_and_rest_matcher.js.map
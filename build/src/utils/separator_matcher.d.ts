/**
 * RegExp special helper
 * Splits string to head and tail, according to the separator.
 * Removes leading and trailing whitespaces from the head.
 * If a white character is a separator, removes also leading whitespaces from the tail.
 *
 * @example
 ```ts
    const pipeMatcher = createSeparatorMatcher('\\|');

    pipeMatcher.headTail(' Hello  | our world!  '); //=> ['Hello', ' our world!  '];
    pipeMatcher.head(' Hello  | our world!  ') === 'Hello';
    pipeMatcher.tail(' Hello  | our world!  ') === ' our world!  ';
 ```
 *
 * Note: in the separator, escape the characters that have special regexp meaning.
 * For example, for a dot separator, use '\\.' as a separator argument.
 */
export type ISeparatorMatcher = {
    headTail: (s: string) => [string, string];
    head: (s: string) => string;
    tail: (s: string) => string;
};
export declare const createSeparatorMatcher: (separator: string) => ISeparatorMatcher;

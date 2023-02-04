/**
 * Splits string to head and tail, according to the separator.
 * Removes leading and trailing whitespaces from the head. Not from the tail.
 */
export type IHeadTailMatcher = {
    headTail: (s: string) => [string, string];
    head: (s: string) => string;
    tail: (s: string) => string;
};
export declare const createHeadTailMatcher: (separator: string) => IHeadTailMatcher;

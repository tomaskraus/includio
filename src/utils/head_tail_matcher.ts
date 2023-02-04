/**
 * Splits string to head and tail, according to the separator.
 * Removes leading and trailing whitespaces from the head.
 * If a white character is a separator, removes also leading whitespaces from the tail.
 *
 * @example
 ```ts
    const pipeMatcher = createHeadTailMatcher('\\|');

    pipeMatcher.headTail(' Hello  | our world!  '); //=> ['Hello', ' our world!  '];
    pipeMatcher.head(' Hello  | our world!  ') === 'Hello';
    pipeMatcher.tail(' Hello  | our world!  ') === ' our world!  ';
 ```
 *
 * Note: in the separator, escape the characters that have special regexp meaning.
 * For example, for a dot, use '\\.' as a separator argument.
 */
export type IHeadTailMatcher = {
  headTail: (s: string) => [string, string];
  head: (s: string) => string;
  tail: (s: string) => string;
};

export const createHeadTailMatcher = (separator: string): IHeadTailMatcher => {
  const headTail = (s: string): [string, string] => {
    const headGroupReg = new RegExp(`\\s*([^${separator}]*)\\s*`);
    const reg = new RegExp(
      `^${headGroupReg.source}$|^${headGroupReg.source}${separator}(.*)$`
    );
    const matches = s.match(reg) || [''];
    if (typeof matches[2] !== 'undefined') {
      return [matches[2].trim(), matches[3] || ''];
    }
    if (typeof matches[1] !== 'undefined') {
      return [matches[1].trim(), ''];
    }
    return ['', ''];
  };
  return {
    headTail,
    head: (s: string) => headTail(s)[0],
    tail: (s: string) => headTail(s)[1],
  };
};

import {
  ISeparatorMatcher,
  createSeparatorMatcher,
} from '../../src/utils/separator_matcher';

let spaceMatcher: ISeparatorMatcher;
let pipeMatcher: ISeparatorMatcher;

beforeEach(() => {
  spaceMatcher = createSeparatorMatcher(' ');
  pipeMatcher = createSeparatorMatcher('\\|');
});

describe('special regexp chars in separator string', () => {
  test('need to double escape special char meaning', () => {
    const dotMatcher = createSeparatorMatcher('\\.');

    expect(dotMatcher.headTail('a.b.c')).toEqual(['a', 'b.c']);
    expect(dotMatcher.head('a.b.c')).toEqual('a');
    expect(dotMatcher.tail('a.b.c')).toEqual('b.c');
  });
});

describe('HeadTailMatcher', () => {
  test('on empty string, returns empty head and empty tail', () => {
    expect(spaceMatcher.headTail('')).toEqual(['', '']);
    expect(spaceMatcher.head('')).toEqual('');
    expect(spaceMatcher.tail('')).toEqual('');

    expect(pipeMatcher.headTail('')).toEqual(['', '']);
    expect(pipeMatcher.head('')).toEqual('');
    expect(pipeMatcher.tail('')).toEqual('');
  });

  test('on string that contains only one separator, returns empty head and empty tail', () => {
    expect(spaceMatcher.headTail(' ')).toEqual(['', '']);
    expect(spaceMatcher.head(' ')).toEqual('');
    expect(spaceMatcher.tail(' ')).toEqual('');

    expect(pipeMatcher.headTail('|')).toEqual(['', '']);
    expect(pipeMatcher.head('|')).toEqual('');
    expect(pipeMatcher.tail('|')).toEqual('');
  });

  test('removes leading white spaces first. Even if white space is a separator!', () => {
    expect(spaceMatcher.headTail('   ')).toEqual(['', '']);
    expect(spaceMatcher.head('   ')).toEqual('');
    expect(spaceMatcher.tail('   ')).toEqual('');

    expect(pipeMatcher.headTail('   | ')).toEqual(['', ' ']);
    expect(pipeMatcher.head('   | ')).toEqual('');
    expect(pipeMatcher.tail('   | ')).toEqual(' ');
  });

  test('trims the head (even if a separator is a white space!)', () => {
    expect(spaceMatcher.head(' hello  ')).toEqual('hello');

    expect(pipeMatcher.head(' hello  ')).toEqual('hello');
    expect(pipeMatcher.head('   | abc ')).toEqual('');
  });

  test('if separator is white char, removes leading white spaces from the tail)', () => {
    expect(spaceMatcher.headTail(' hello  our world ')).toEqual([
      'hello',
      'our world ',
    ]);
    expect(spaceMatcher.head(' hello  our world ')).toEqual('hello');
    expect(spaceMatcher.tail(' hello  our world ')).toEqual('our world ');
  });

  test('tail is the rest of the original string', () => {
    expect(pipeMatcher.tail(' hello  | our  world ')).toEqual(' our  world ');
    expect(pipeMatcher.tail(' hello|')).toEqual('');
    expect(pipeMatcher.tail(' hello| ')).toEqual(' ');

    expect(spaceMatcher.tail(' hello  | our  world ')).toEqual('| our  world ');
  });

  test('consumes the first (non white char) separator occurence (removes leading white spaces first!)', () => {
    expect(pipeMatcher.headTail('  hello | our world | ! ')).toEqual([
      'hello',
      ' our world | ! ',
    ]);
    expect(pipeMatcher.head('  hello | our world | ! ')).toEqual('hello');
    expect(pipeMatcher.tail('  hello | our world | ! ')).toEqual(
      ' our world | ! '
    );
  });
});

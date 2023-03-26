import {getIndentStr} from '../../src/core/common';

test('getIndentStr', () => {
  expect(getIndentStr('')).toEqual('');
  expect(getIndentStr(' ')).toEqual(' ');
  expect(getIndentStr('abc')).toEqual('');
  expect(getIndentStr('  abc ')).toEqual('  ');
});

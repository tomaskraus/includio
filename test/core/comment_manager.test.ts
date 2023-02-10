import {DEFAULT_INCLUDO_OPTIONS, TIncludoOptions} from '../../src/core/common';
import {createCommentManager} from '../../src/core/comment_manager';

describe('Commentmanager', () => {
  const options: TIncludoOptions = {
    ...DEFAULT_INCLUDO_OPTIONS,
    defaultCommentPair: ['--', '-'],
    commentPairMap: [
      ['js', '/*', '*/'],
      ['html', '<!--', '-->'],
    ],
  };

  const cm = createCommentManager(options);

  test('knows defaults', () => {
    expect(cm.defaultStartComment).toEqual('--');
    expect(cm.defaultEndComment).toEqual('-');
  });

  test('returns proper comments for filename with known extension', () => {
    expect(cm.startTag('test.js')).toEqual('/*');
    expect(cm.endTag('test.js')).toEqual('*/');
  });

  test('returns default comments for empty filename', () => {
    expect(cm.startTag('')).toEqual('--');
    expect(cm.endTag('')).toEqual('-');
  });

  test('returns default comments if extension is not found', () => {
    expect(cm.startTag('test.sql')).toEqual('--');
    expect(cm.endTag('test.sql')).toEqual('-');
  });

  test('returns default comments for filename with no extension', () => {
    expect(cm.startTag('js')).toEqual('--');
    expect(cm.endTag('js')).toEqual('-');
  });
});

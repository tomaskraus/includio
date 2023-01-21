import mock from 'mock-fs';

import {createIncludoProcessor, DEFAULT_INCLUDO_OPTIONS} from '../src/includo';
import stream from 'stream';

import * as mStream from 'memory-streams';

let output: stream.Writable;

beforeEach(() => {
  mock({
    'mark-valid-exists.txt': 'Hello, \n@@ source1.txt mark1 \nWorld!\n',
    'mark-valid-exists-empty-content.txt':
      'Hello, \n@@ source-empty-content-mark.txt mark1 \nWorld!\n',
    'mark-valid-exists-source-with-empty-mark-name.txt':
      'Hello, \n@@ source-mark-without-name.txt mark1 \nWorld!\n',
    'mark-valid-source-with-no-marks.txt':
      'Hello, \n@@ source-with-no-marks.txt mark1 \nWorld!\n',
    'mark-valid-exists-quoted-file.txt':
      'Hello, \n@@ "source 1.txt" mark1 \nWorld!\n',
    'mark-valid-nonexistent.txt':
      'Hello, \none\n@@ source1.txt nonexistentMark \nWorld!',
    'mark-invalid.txt':
      'Hello, \na second\n@@ source1.txt *invalidMark \nWorld!',
    'tag-nonexistent-file-name.txt':
      'Hello, \n@@ nonexistentfile.txt mark1 \nWorld!',
    'source1.txt': 'text1 \n //< mark1 \n m1 line1 \nm1 line2\n//> \ntext2',
    'source 1.txt': 'text1 \n //< mark1 \n m1 line1 \nm1 line2\n//> \ntext2',
    'source-empty-content-mark.txt':
      'text1 \n //< mark1\n//> \ntext2 \n //< mark2 \n m1 line1 \nm1 line2\n//> ',
    'source-mark-without-name.txt':
      'text1 \n //< mark1 \n m1 line1 \nm1 line2\n//> \ntext2 //< \n abc\n//<',
    'source-with-no-marks.txt': 'text1 \n \ntext2 ',
    'dir-for-insert': {
      'source-with-no-marks.txt': 'text1 \n \ntext2 ',
    },
  });
  mock.file();

  output = new mStream.WritableStream();
});

afterEach(() => {
  mock.restore();
});

describe('normal ops', () => {
  test('valid existent mark name', async () => {
    const p = createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);

    const res = await p('mark-valid-exists.txt', output);
    expect(res.lineNumber).toEqual(4);
    expect(output.toString()).toEqual(
      'Hello, \n m1 line1 \nm1 line2\nWorld!\n'
    );
  });

  test('valid existent mark name, quoted file name', async () => {
    const p = createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);

    const res = await p('mark-valid-exists-quoted-file.txt', output);
    expect(res.lineNumber).toEqual(4);
    expect(output.toString()).toEqual(
      'Hello, \n m1 line1 \nm1 line2\nWorld!\n'
    );
  });

  test('valid existent mark name, empty mark content - inserts empty line', async () => {
    const p = createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);

    const res = await p('mark-valid-exists-empty-content.txt', output);
    expect(res.lineNumber).toEqual(4);
    expect(output.toString()).toEqual('Hello, \n\nWorld!\n');
  });

  test('empty mark name in source file - processes without error', async () => {
    const p = createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);

    const res = await p(
      'mark-valid-exists-source-with-empty-mark-name.txt',
      output
    );
    expect(res.lineNumber).toEqual(4);
    expect(output.toString()).toEqual(
      'Hello, \n m1 line1 \nm1 line2\nWorld!\n'
    );
  });
});

describe('error handling', () => {
  test('nonexistent mark name', async () => {
    expect.assertions(3);
    const p = createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);
    try {
      await p('mark-valid-nonexistent.txt', output);
    } catch (e) {
      expect((e as Error).message).toContain('mark-valid-nonexistent.txt:3'); //file&line info
      expect((e as Error).message).toContain('@@ source1.txt nonexistentMark '); //line
      expect((e as Error).message).toContain('[nonexistentMark] not found'); //err
    }
  });

  test('use mark from file that contains no marks', async () => {
    expect.assertions(3);
    const p = createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);
    try {
      await p('mark-valid-source-with-no-marks.txt', output);
    } catch (e) {
      expect((e as Error).message).toContain(
        'mark-valid-source-with-no-marks.txt:2'
      ); //file&line info
      expect((e as Error).message).toContain(
        '@@ source-with-no-marks.txt mark1 '
      ); //line
      expect((e as Error).message).toContain('No marks found'); //err
    }
  });

  test('use mark from file that contains no marks. Custom BaseDir', async () => {
    expect.assertions(4);
    const p = createIncludoProcessor({baseDir: 'dir-for-insert'});
    try {
      await p('mark-valid-source-with-no-marks.txt', output);
    } catch (e) {
      expect((e as Error).message).toContain(
        'mark-valid-source-with-no-marks.txt:2'
      ); //file&line info
      expect((e as Error).message).toContain(
        '@@ source-with-no-marks.txt mark1 '
      ); //line
      expect((e as Error).message).toContain('No marks found'); //err
      expect((e as Error).message).toContain(
        'dir-for-insert/source-with-no-marks.txt'
      ); //contains basedir in file path
    }
  });

  test('invalid mark', async () => {
    expect.assertions(3);
    const p = createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);
    try {
      await p('mark-invalid.txt', output);
    } catch (e) {
      expect((e as Error).message).toContain('mark-invalid.txt:3'); //file&line info
      expect((e as Error).message).toContain('@@ source1.txt *invalidMark '); //line
      expect((e as Error).message).toContain('Invalid tag content'); //err
    }
  });

  test('Non-existent file for insertion', async () => {
    expect.assertions(3);
    const p = createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);
    try {
      await p('tag-nonexistent-file-name.txt', output);
    } catch (e) {
      expect((e as Error).message).toContain('tag-nonexistent-file-name.txt:2'); //file&line info
      expect((e as Error).message).toContain('@@ nonexistentfile.txt '); //line
      expect((e as Error).message).toContain('ENOENT'); //err
    }
  });

  test('Non-existent baseDir', async () => {
    expect.assertions(4);
    const p = createIncludoProcessor({baseDir: 'abc'});
    try {
      await p('mark-valid-exists.txt', output);
    } catch (e) {
      expect((e as Error).message).toContain('mark-valid-exists.txt'); //file&line info
      expect((e as Error).message).toContain('@@ source1.txt '); //line
      expect((e as Error).message).toContain('ENOENT'); //err
      expect((e as Error).message).toContain('abc/source1.txt'); //err - file info
    }
  });
});

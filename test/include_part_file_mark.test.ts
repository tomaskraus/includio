import mock from 'mock-fs';

import {createIncludoProcessor, DEFAULT_INCLUDO_OPTIONS} from '../src/includo';
import stream from 'stream';

import * as mStream from 'memory-streams';
// import * as fs from 'fs';

// let input: stream.Readable;
let output: stream.Writable;

beforeEach(() => {
  mock({
    'mark-valid-exists.txt': 'Hello, \n@@ source1.txt mark1 \nWorld!\n',
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
  });
  mock.file();

  // input = fs.createReadStream('my-file.txt');
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

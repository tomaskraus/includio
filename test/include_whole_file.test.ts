import mock from 'mock-fs';

import {createIncludoProcessor, DEFAULT_INCLUDO_OPTIONS} from '../src/includo';
import stream from 'stream';

import * as mStream from 'memory-streams';
// import * as fs from 'fs';

// let input: stream.Readable;
let output: stream.Writable;

beforeEach(() => {
  mock({
    'tag-valid-file-name.txt': 'Hello, \n@@ source1.txt \nWorld!\n',
    // 'tag-valid-file-name-in-single-quotes.txt':
    //   "Hello, \n@@ 'someFile 2.txt' \nWorld!\n",
    'tag-valid-file-path.txt': 'Hello, \n@@ ./source1.txt \nWorld!\n',
    'tag-valid-file-name-in-double-quotes.txt':
      'Hello, \n@@ "source1.txt" \nWorld!\n',
    'tag-invalid-file-name.txt': 'Hello, \n@@ ab*cd \nWorld!',
    'tag-nonexistent-file-name.txt': 'Hello, \n@@ nonexistentfile.txt \nWorld!',
    'source1.txt': '-- text insert --\n-- text line2 --\n',
    'dir-for-insert': {
      'source1.txt': '-- dir text insert --\n-- dir text line2 --\n',
    },
  });
  mock.file();

  // input = fs.createReadStream('my-file.txt');
  output = new mStream.WritableStream();
});

afterEach(() => {
  mock.restore();
});

describe('normal ops', () => {
  test('input with valid file name tag', async () => {
    const p = createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);

    const res = await p('tag-valid-file-name.txt', output);
    expect(res.lineNumber).toEqual(4);
    expect(output.toString()).toEqual(
      'Hello, \n-- text insert --\n-- text line2 --\n\nWorld!\n'
    );
  });

  test('input with valid file name tag, using non-empty baseDir', async () => {
    const p = createIncludoProcessor({baseDir: 'dir-for-insert'});

    const res = await p('tag-valid-file-name.txt', output);
    expect(res.lineNumber).toEqual(4);
    expect(output.toString()).toEqual(
      'Hello, \n-- dir text insert --\n-- dir text line2 --\n\nWorld!\n'
    );
  });

  test('input with valid file name (in double-quotes) tag', async () => {
    const p = createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);

    const res = await p('tag-valid-file-name-in-double-quotes.txt', output);
    expect(res.lineNumber).toEqual(4);
    expect(output.toString()).toEqual(
      'Hello, \n-- text insert --\n-- text line2 --\n\nWorld!\n'
    );
  });

  test('input with valid file name (including a path) tag', async () => {
    const p = createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);

    const res = await p('tag-valid-file-path.txt', output);
    expect(res.lineNumber).toEqual(4);
    expect(output.toString()).toEqual(
      'Hello, \n-- text insert --\n-- text line2 --\n\nWorld!\n'
    );
  });
});

describe('error handling', () => {
  test('Invalid file name for insertion (with invalid characters in file name)', async () => {
    expect.assertions(3);
    const p = createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);
    try {
      await p('tag-invalid-file-name.txt', output);
    } catch (e) {
      expect((e as Error).message).toContain('tag-invalid-file-name.txt:2'); //file&line info
      expect((e as Error).message).toContain('@@ ab*cd '); //line
      expect((e as Error).message).toContain('Invalid'); //err
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
      await p('tag-valid-file-name.txt', output);
    } catch (e) {
      expect((e as Error).message).toContain('tag-valid-file-name.txt'); //file&line info
      expect((e as Error).message).toContain('@@ source1.txt '); //line
      expect((e as Error).message).toContain('ENOENT'); //err
      expect((e as Error).message).toContain('abc/source1.txt'); //err - file info
    }
  });
});
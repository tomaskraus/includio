import mock from 'mock-fs';

import {createIncludoProcessor, DEFAULT_INCLUDO_OPTIONS} from '../src/includo';
import stream from 'stream';

import * as mStream from 'memory-streams';
// import * as fs from 'fs';

// let input: stream.Readable;
let output: stream.Writable;

beforeEach(() => {
  mock({
    'tag-valid-file-name.txt': 'Hello, \n@@ someFile.txt \nWorld!\n',
    // 'tag-valid-file-name-in-single-quotes.txt':
    //   "Hello, \n@@ 'someFile 2.txt' \nWorld!\n",
    'tag-valid-file-path.txt': 'Hello, \n@@ ./someDir/someFile.txt \nWorld!\n',
    'tag-valid-file-name-in-double-quotes.txt':
      'Hello, \n@@ "someFile 2.txt" \nWorld!\n',
    'tag-invalid-file-name.txt': 'Hello, \n@@ ab*cd \nWorld!',
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
    expect(output.toString()).toEqual('Hello, \n--insertion--\nWorld!\n');
  });

  test('input with valid file name (in double-quotes) tag', async () => {
    const p = createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);

    const res = await p('tag-valid-file-name-in-double-quotes.txt', output);
    expect(res.lineNumber).toEqual(4);
    expect(output.toString()).toEqual('Hello, \n--insertion--\nWorld!\n');
  });

  test('input with valid file name (including a path) tag', async () => {
    const p = createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);

    const res = await p('tag-valid-file-path.txt', output);
    expect(res.lineNumber).toEqual(4);
    expect(output.toString()).toEqual('Hello, \n--insertion--\nWorld!\n');
  });
});

describe('error handling', () => {
  test('Invalid file name (with invalid characters in file name)', async () => {
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
});

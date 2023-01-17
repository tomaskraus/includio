import mock from 'mock-fs';

import {createIncludoProcessor, DEFAULT_INCLUDO_OPTIONS} from '../src/includo';
import stream from 'stream';

import * as mStream from 'memory-streams';
// import * as fs from 'fs';

// let input: stream.Readable;
let output: stream.Writable;

beforeEach(() => {
  mock({
    'empty-file.txt': '',
    'no-tag-file.txt': 'Hello, \nWorld!',
    'my-file.txt': 'Hello, \n@@ id\nWorld!\n',
    'error-file.txt': 'Hello, \n@@  \nWorld!',
  });
  mock.file();

  // input = fs.createReadStream('my-file.txt');
  output = new mStream.WritableStream();
});

afterEach(() => {
  mock.restore();
});

describe('normal ops', () => {
  test('empty input', async () => {
    const p = createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);

    const res = await p('empty-file.txt', output);
    expect(res.lineNumber).toEqual(0);
    expect(output.toString()).toEqual('');
  });

  test('input without tags', async () => {
    const p = createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);

    const res = await p('no-tag-file.txt', output);
    expect(res.lineNumber).toEqual(2);
    expect(output.toString()).toEqual('Hello, \nWorld!');
  });

  test('input with tags', async () => {
    const p = createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);

    const res = await p('my-file.txt', output);
    expect(res.lineNumber).toEqual(4);
    expect(output.toString()).toEqual('Hello, \n--insertion--\nWorld!\n');
  });
});

describe('error handling', () => {
  test('Nonexistent input file', async () => {
    expect.assertions(1);
    const p = createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);
    try {
      await p('non-existent-file.txt', output);
    } catch (e) {
      expect((e as Error).message).toContain('ENOENT'); //file&line info
    }
  });

  test('Include line value, file name & line number and Error message', async () => {
    expect.assertions(3);
    const p = createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);
    try {
      await p('error-file.txt', output);
    } catch (e) {
      expect((e as Error).message).toContain('error-file.txt:2'); //file&line info
      expect((e as Error).message).toContain('@@'); //line
      expect((e as Error).message).toContain('empty'); //err
    }
  });
});

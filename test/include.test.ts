import mock from 'mock-fs';

import {
  createIncludoProcessor,
  DEFAULT_INCLUDO_OPTIONS,
} from '../src/core/includo';
import stream from 'stream';

import * as mStream from 'memory-streams';
import {LineMachineError} from 'line-transform-machines';
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
});

describe('error handling', () => {
  test('Nonexistent input file', async () => {
    expect.assertions(1);
    const p = createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);
    try {
      await p('non-existent-file.txt', output);
    } catch (e) {
      expect((e as LineMachineError).message).toContain('ENOENT'); //file&line info
    }
  });

  test('Empty tag: Include line value, file name & line number and Error message', async () => {
    expect.assertions(6);
    const p = createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);
    try {
      await p('error-file.txt', output);
    } catch (e) {
      expect(e).toBeInstanceOf(LineMachineError);
      const lerr = e as LineMachineError;
      expect(lerr.message).toContain('empty tag not allowed');
      expect(lerr.at).toContain('error-file.txt:2');
      expect(lerr.lineNumber).toEqual(2);
      expect(lerr.inputFileName).toEqual('error-file.txt');
      expect(lerr.lineValue).toEqual('@@  ');
    }
  });
});

import mock from 'mock-fs';

import {
  createIncludioProcessor,
  DEFAULT_INCLUDIO_OPTIONS,
} from '../../src/core/includio';
import stream from 'stream';

import * as mStream from 'memory-streams';
import {LineMachineError} from 'line-transform-machines';
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
      'Hello, \n@@ "source 1.txt" \nWorld!\n',
    'tag-empty-file.txt': 'Hello, \n@@ ./source_empty.txt \nWorld!\n',
    'tag-invalid-file-name.txt': 'Hello, \n@@ ab*cd \nWorld!',
    'tag-nonexistent-file-name.txt': 'Hello, \n@@ nonexistentfile.txt \nWorld!',
    'unknown-cmd-name.txt': 'Hello, \n@@ source1.txt unknownCmd:  \nWorld!\n',

    'source1.txt': '-- text insert --\n-- text line2 --\n',
    'source 1.txt': '-- "text" insert --\n-- text line2 --\n',
    'source_empty.txt': '',
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
    const p = createIncludioProcessor(DEFAULT_INCLUDIO_OPTIONS);

    const res = await p('tag-valid-file-name.txt', output);
    expect(res.lineNumber).toEqual(4);
    expect(output.toString()).toEqual(
      'Hello, \n-- text insert --\n-- text line2 --\n\nWorld!\n'
    );
  });

  test('input with valid file name tag, using non-empty resourceDir', async () => {
    const p = createIncludioProcessor({resourceDir: 'dir-for-insert'});

    const res = await p('tag-valid-file-name.txt', output);
    expect(res.lineNumber).toEqual(4);
    expect(output.toString()).toEqual(
      'Hello, \n-- dir text insert --\n-- dir text line2 --\n\nWorld!\n'
    );
  });

  test('input with valid file name (in double-quotes) tag', async () => {
    const p = createIncludioProcessor(DEFAULT_INCLUDIO_OPTIONS);

    const res = await p('tag-valid-file-name-in-double-quotes.txt', output);
    expect(res.lineNumber).toEqual(4);
    expect(output.toString()).toEqual(
      'Hello, \n-- "text" insert --\n-- text line2 --\n\nWorld!\n'
    );
  });

  test('input with empty file with valid name tag adds empty line', async () => {
    const p = createIncludioProcessor(DEFAULT_INCLUDIO_OPTIONS);

    const res = await p('tag-empty-file.txt', output);
    expect(res.lineNumber).toEqual(4);
    expect(output.toString()).toEqual('Hello, \n\nWorld!\n');
  });

  test('input with valid file name (including a path) tag', async () => {
    const p = createIncludioProcessor(DEFAULT_INCLUDIO_OPTIONS);

    const res = await p('tag-valid-file-path.txt', output);
    expect(res.lineNumber).toEqual(4);
    expect(output.toString()).toEqual(
      'Hello, \n-- text insert --\n-- text line2 --\n\nWorld!\n'
    );
  });
});

describe('error handling', () => {
  test('Invalid file name for insertion (with invalid characters in file name)', async () => {
    expect.assertions(2);
    const p = createIncludioProcessor(DEFAULT_INCLUDIO_OPTIONS);
    try {
      await p('tag-invalid-file-name.txt', output);
    } catch (e) {
      expect(e).toBeInstanceOf(LineMachineError);
      expect((e as LineMachineError).message).toContain('Invalid');
    }
  });

  test('Non-existent file for insertion', async () => {
    expect.assertions(2);
    const p = createIncludioProcessor(DEFAULT_INCLUDIO_OPTIONS);
    try {
      await p('tag-nonexistent-file-name.txt', output);
    } catch (e) {
      expect(e).toBeInstanceOf(LineMachineError);
      expect((e as LineMachineError).message).toContain('ENOENT'); //err
    }
  });

  test('Non-existent file for insertion, in existent resourceDir', async () => {
    expect.assertions(2);
    const p = createIncludioProcessor({resourceDir: 'dir-for-insert'});
    try {
      await p('tag-nonexistent-file-name.txt', output);
    } catch (e) {
      expect(e).toBeInstanceOf(LineMachineError);
      expect((e as LineMachineError).message).toContain('ENOENT'); //err
    }
  });

  test('Non-existent resourceDir', async () => {
    expect.assertions(2);
    const p = createIncludioProcessor({resourceDir: 'abc'});
    try {
      await p('tag-valid-file-name.txt', output);
    } catch (e) {
      expect(e).toBeInstanceOf(LineMachineError);
      expect((e as LineMachineError).message).toContain('ENOENT'); //err
    }
  });
});

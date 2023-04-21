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
    'directive-valid-file-name.txt': 'Hello, \n@@ source1.txt \nWorld!\n',
    'directive-valid-file-name-indented.txt':
      'Hello, \n   @@ source1.txt \nWorld!\n',
    // 'directive-valid-file-name-in-single-quotes.txt':
    //   "Hello, \n@@ 'someFile 2.txt' \nWorld!\n",
    'directive-valid-file-path.txt': 'Hello, \n@@ ./source1.txt \nWorld!\n',
    'directive-valid-file-name-in-double-quotes.txt':
      'Hello, \n@@ "source 1.txt" \nWorld!\n',
    'directive-empty-file.txt': 'Hello, \n@@ ./source_empty.txt \nWorld!\n',
    'directive-invalid-file-name.txt': 'Hello, \n@@ ab*cd \nWorld!',
    'directive-nonexistent-file-name.txt':
      'Hello, \n@@ nonexistentfile.txt \nWorld!',
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
  test('input with valid file name directive', async () => {
    const p = createIncludioProcessor(DEFAULT_INCLUDIO_OPTIONS).lineMachine;

    const res = await p('directive-valid-file-name.txt', output);
    expect(res.lineNumber).toEqual(4);
    expect(output.toString()).toEqual(
      'Hello, \n-- text insert --\n-- text line2 --\n\nWorld!\n'
    );
  });

  test('input with valid file name directive, indented', async () => {
    const p = createIncludioProcessor(DEFAULT_INCLUDIO_OPTIONS).lineMachine;

    const res = await p('directive-valid-file-name-indented.txt', output);
    expect(res.lineNumber).toEqual(4);
    expect(output.toString()).toEqual(
      'Hello, \n   -- text insert --\n   -- text line2 --\n   \nWorld!\n'
    );
  });

  test('input with valid file name directive, using non-empty resourceDir', async () => {
    const p = createIncludioProcessor({
      resourceDir: 'dir-for-insert',
    }).lineMachine;

    const res = await p('directive-valid-file-name.txt', output);
    expect(res.lineNumber).toEqual(4);
    expect(output.toString()).toEqual(
      'Hello, \n-- dir text insert --\n-- dir text line2 --\n\nWorld!\n'
    );
  });

  test('input with valid file name (in double-quotes) directive', async () => {
    const p = createIncludioProcessor(DEFAULT_INCLUDIO_OPTIONS).lineMachine;

    const res = await p(
      'directive-valid-file-name-in-double-quotes.txt',
      output
    );
    expect(res.lineNumber).toEqual(4);
    expect(output.toString()).toEqual(
      'Hello, \n-- "text" insert --\n-- text line2 --\n\nWorld!\n'
    );
  });

  test('input with empty file with valid name directive adds empty line', async () => {
    const p = createIncludioProcessor(DEFAULT_INCLUDIO_OPTIONS).lineMachine;

    const res = await p('directive-empty-file.txt', output);
    expect(res.lineNumber).toEqual(4);
    expect(output.toString()).toEqual('Hello, \n\nWorld!\n');
  });

  test('input with valid file name (including a path) directive', async () => {
    const p = createIncludioProcessor(DEFAULT_INCLUDIO_OPTIONS).lineMachine;

    const res = await p('directive-valid-file-path.txt', output);
    expect(res.lineNumber).toEqual(4);
    expect(output.toString()).toEqual(
      'Hello, \n-- text insert --\n-- text line2 --\n\nWorld!\n'
    );
  });
});

describe('error handling', () => {
  test('Invalid file name for insertion (with invalid characters in file name)', async () => {
    expect.assertions(2);
    const p = createIncludioProcessor(DEFAULT_INCLUDIO_OPTIONS).lineMachine;
    try {
      await p('directive-invalid-file-name.txt', output);
    } catch (e) {
      expect(e).toBeInstanceOf(LineMachineError);
      expect((e as LineMachineError).message).toContain('Invalid');
    }
  });

  test('Non-existent file for insertion', async () => {
    expect.assertions(2);
    const p = createIncludioProcessor(DEFAULT_INCLUDIO_OPTIONS).lineMachine;
    try {
      await p('directive-nonexistent-file-name.txt', output);
    } catch (e) {
      expect(e).toBeInstanceOf(LineMachineError);
      expect((e as LineMachineError).message).toContain('ENOENT'); //err
    }
  });

  test('Non-existent file for insertion, in existent resourceDir', async () => {
    expect.assertions(2);
    const p = createIncludioProcessor({
      resourceDir: 'dir-for-insert',
    }).lineMachine;
    try {
      await p('directive-nonexistent-file-name.txt', output);
    } catch (e) {
      expect(e).toBeInstanceOf(LineMachineError);
      expect((e as LineMachineError).message).toContain('ENOENT'); //err
    }
  });

  test('Non-existent resourceDir', async () => {
    expect.assertions(2);
    const p = createIncludioProcessor({resourceDir: 'abc'}).lineMachine;
    try {
      await p('directive-valid-file-name.txt', output);
    } catch (e) {
      expect(e).toBeInstanceOf(LineMachineError);
      expect((e as LineMachineError).message).toContain('ENOENT'); //err
    }
  });
});

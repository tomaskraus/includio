import mock from 'mock-fs';

import {
  createIncludoProcessor,
  DEFAULT_INCLUDO_OPTIONS,
} from '../src/core/includo';
import stream from 'stream';

import * as mStream from 'memory-streams';
import {LineMachineError} from 'line-transform-machines';

let output: stream.Writable;

beforeEach(() => {
  mock({
    'first-cmd-more-args.txt':
      'Hello, \n@@ source1.txt : part1 | first 1, 2 \nWorld!\n',

    'first-cmd-chaining.txt':
      'Hello, \n@@ source1.txt : part1 | first 2 | first 1 \nWorld!\n',

    'first-cmd-view-more.txt':
      'Hello, \n@@ source1.txt : part1 | first 4 \nWorld!\n',
    'first-cmd-view-less.txt':
      'Hello, \n@@ source1.txt | first 3 \n our\n World!\n',
    'first-cmd-view-exact.txt':
      'Hello, \n@@ source1.txt : part1 | first 2 \nWorld!\n',

    'first-cmd-no-args.txt':
      'Hello, \n@@ source1.txt : part1 | first \nWorld!\n',
    'first-cmd-invalid-args.txt':
      'Hello, \n@@ source1.txt : part1 | first abc \nWorld!\n',
    'first-cmd-out-of-range-args.txt':
      'Hello, \n@@ source1.txt : part1 | first 0 \nWorld!\n',

    'last-cmd-view-more.txt':
      'Hello, \n@@ source1.txt : part1 | last 4 \nWorld!\n',
    'last-cmd-view-less.txt':
      'Hello, \n@@ source1.txt | last 3 \n our\n World!\n',
    'last-cmd-view-exact.txt':
      'Hello, \n@@ source1.txt : part1 | last 2 \nWorld!\n',

    'unknown-cmd.txt': 'Hello, \n@@ source1.txt | unkn \nWorld!\n',
    'invalid-cmd.txt': 'Hello, \n@@ source1.txt | in*valid 24 \nWorld!\n',

    'empty-pipe.txt': 'Hello, \n@@ source1.txt | \nWorld!\n',
    'empty-pipe-part.txt': 'Hello, \n@@ source1.txt : part1 |\nWorld!\n',

    'source1.txt': 'text1 \n //< part1 \n m1 line1 \nm1 line2\n//< \ntext2',

    'dir-for-insert': {
      'source-with-no-parts.txt': 'text1 \n \ntext2 ',
    },
  });
  mock.file();

  output = new mStream.WritableStream();
});

afterEach(() => {
  mock.restore();
});

describe('command: common behavior', () => {
  test('accepts more arguments than necessary', async () => {
    const p = createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);

    await p('first-cmd-more-args.txt', output);
    expect(output.toString()).toEqual('Hello, \n m1 line1 \n...\nWorld!\n');
  });

  test('supports command chaining via pipeline', async () => {
    const p = createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);

    await p('first-cmd-chaining.txt', output);
    expect(output.toString()).toEqual('Hello, \n m1 line1 \n...\nWorld!\n');
  });
});

describe('command: first', () => {
  test('view more than provided', async () => {
    const p = createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);

    await p('first-cmd-view-more.txt', output);
    expect(output.toString()).toEqual(
      'Hello, \n m1 line1 \nm1 line2\nWorld!\n'
    );
  });

  test('view less than provided', async () => {
    const p = createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);

    await p('first-cmd-view-less.txt', output);
    expect(output.toString()).toEqual(
      'Hello, \ntext1 \n //< part1 \n m1 line1 \n...\n our\n World!\n'
    );
  });

  test('view exactly the line count what provided', async () => {
    const p = createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);

    await p('first-cmd-view-exact.txt', output);
    expect(output.toString()).toEqual(
      'Hello, \n m1 line1 \nm1 line2\nWorld!\n'
    );
  });
});

describe('command: first - errors', () => {
  test('no args', async () => {
    expect.assertions(3);
    const p = createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);
    try {
      await p('first-cmd-no-args.txt', output);
    } catch (e) {
      expect(e).toBeInstanceOf(LineMachineError);
      expect((e as LineMachineError).message).toContain('first <number>'); //err
      expect((e as LineMachineError).message).toContain(
        'no integer value found'
      ); //err
    }
  });

  test('invalid args', async () => {
    expect.assertions(3);
    const p = createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);
    try {
      await p('first-cmd-invalid-args.txt', output);
    } catch (e) {
      expect(e).toBeInstanceOf(LineMachineError);
      expect((e as LineMachineError).message).toContain('first <number>'); //err
      expect((e as LineMachineError).message).toContain('not a number'); //err
    }
  });

  test('out of range args', async () => {
    expect.assertions(3);
    const p = createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);
    try {
      await p('first-cmd-out-of-range-args.txt', output);
    } catch (e) {
      expect(e).toBeInstanceOf(LineMachineError);
      expect((e as LineMachineError).message).toContain('first <number>'); //err
      expect((e as LineMachineError).message).toContain('(0) is lower than'); //err
    }
  });
});

describe('command: last', () => {
  test('view more than provided', async () => {
    const p = createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);

    await p('last-cmd-view-more.txt', output);
    expect(output.toString()).toEqual(
      'Hello, \n m1 line1 \nm1 line2\nWorld!\n'
    );
  });

  test('view less than provided', async () => {
    const p = createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);

    await p('last-cmd-view-less.txt', output);
    expect(output.toString()).toEqual(
      'Hello, \n...\nm1 line2\n//< \ntext2\n our\n World!\n'
    );
  });

  test('view exactly the line count what provided', async () => {
    const p = createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);

    await p('last-cmd-view-exact.txt', output);
    expect(output.toString()).toEqual(
      'Hello, \n m1 line1 \nm1 line2\nWorld!\n'
    );
  });
});

describe('general error handling', () => {
  test('empty pipe', async () => {
    expect.assertions(2);
    const p = createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);
    try {
      await p('empty-pipe.txt', output);
    } catch (e) {
      expect(e).toBeInstanceOf(LineMachineError);
      expect((e as LineMachineError).message).toContain(
        'Empty command in pipe'
      ); //err
    }
  });
  test('invalid command name', async () => {
    expect.assertions(3);
    const p = createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);
    try {
      await p('invalid-cmd.txt', output);
    } catch (e) {
      expect(e).toBeInstanceOf(LineMachineError);
      expect((e as LineMachineError).message).toContain('Invalid command name'); //err
      expect((e as LineMachineError).message).toContain('(in*valid 24)'); //err
    }
  });
  test('unknown command', async () => {
    expect.assertions(3);
    const p = createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);
    try {
      await p('unknown-cmd.txt', output);
    } catch (e) {
      expect(e).toBeInstanceOf(LineMachineError);
      expect((e as LineMachineError).message).toContain('Unknown command'); //err
      expect((e as LineMachineError).message).toContain('(unkn)'); //err
    }
  });
});

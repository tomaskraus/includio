import mock from 'mock-fs';

import {createIncludoProcessor, DEFAULT_INCLUDO_OPTIONS} from '../src/includo';
import stream from 'stream';

import * as mStream from 'memory-streams';

let output: stream.Writable;

beforeEach(() => {
  mock({
    'first-cmd-view-more.txt':
      'Hello, \n@@ source1.txt : part1 | first 3 \nWorld!\n',
    'first-cmd-view-less.txt':
      'Hello, \n@@ source1.txt | first 3 \n our\n World!\n',
    'first-cmd-view-exact.txt':
      'Hello, \n@@ source1.txt : part1 | first 2 \nWorld!\n',

    'first-cmd-no-args.txt':
      'Hello, \n@@ source1.txt : part1 | first \nWorld!\n',

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
      'Hello, \ntext1 \n //< part1 \n m1 line1 \n our\n World!\n'
    );
  });

  test('no args', async () => {
    expect.assertions(3);
    const p = createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);
    try {
      await p('first-cmd-no-args.txt', output);
    } catch (e) {
      expect((e as Error).message).toContain('first-cmd-no-args.txt:2'); //file&line info
      expect((e as Error).message).toContain('@@ source1.txt : part1 | first'); //line
      expect((e as Error).message).toContain('argument required'); //err
    }
  });
});

describe('general error handling', () => {
  test('empty pipe', async () => {
    expect.assertions(3);
    const p = createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);
    try {
      await p('empty-pipe.txt', output);
    } catch (e) {
      expect((e as Error).message).toContain('empty-pipe.txt:2'); //file&line info
      expect((e as Error).message).toContain('@@ source1.txt | '); //line
      expect((e as Error).message).toContain('Empty command in pipe'); //err
    }
  });
  test('invalid command name', async () => {
    expect.assertions(4);
    const p = createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);
    try {
      await p('invalid-cmd.txt', output);
    } catch (e) {
      expect((e as Error).message).toContain('invalid-cmd.txt:2'); //file&line info
      expect((e as Error).message).toContain('@@ source1.txt | in*valid 24'); //line
      expect((e as Error).message).toContain('Invalid command name'); //err
      expect((e as Error).message).toContain('[in*valid 24]'); //err
    }
  });
  test('unknown command', async () => {
    expect.assertions(4);
    const p = createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);
    try {
      await p('unknown-cmd.txt', output);
    } catch (e) {
      expect((e as Error).message).toContain('unknown-cmd.txt:2'); //file&line info
      expect((e as Error).message).toContain('@@ source1.txt | unkn'); //line
      expect((e as Error).message).toContain('Unknown command'); //err
      expect((e as Error).message).toContain('[unkn]'); //err
    }
  });
});

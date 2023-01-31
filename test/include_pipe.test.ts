import mock from 'mock-fs';

import {createIncludoProcessor, DEFAULT_INCLUDO_OPTIONS} from '../src/includo';
import stream from 'stream';

import * as mStream from 'memory-streams';

let output: stream.Writable;

beforeEach(() => {
  mock({
    'fake-cmd.txt': 'Hello, \n@@ source1.txt : part1 | fake \nWorld!\n',

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

describe('normal ops', () => {
  test('fake command', async () => {
    const p = createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);

    const res = await p('fake-cmd.txt', output);
    expect(res.lineNumber).toEqual(4);
    expect(output.toString()).toEqual(
      'Hello, \n m1 line1 \nm1 line2\nWorld!\n'
    );
  });
});

describe('error handling', () => {
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
});

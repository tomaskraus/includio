import mock from 'mock-fs';

import {
  createTestIncludioProcessor,
  DEFAULT_INCLUDIO_OPTIONS,
} from '../../src/core/includio';
import stream from 'stream';
import fs from 'node:fs';
import * as mStream from 'memory-streams';

let output: stream.Writable;

beforeEach(() => {
  mock({
    'error-file.txt':
      'Hello, \n@@ nonexistent.txt \nWorld!\n@@ source1.txt : p1 \n@@ source1.txt',

    'ok-file.txt': 'Hello, \nWorld!\n@@ source1.txt \n',

    'source1.txt': 'text1 \n //< part1 \n m1 line1 \nm1 line2\n//< \ntext',
  });
  mock.file();

  output = new mStream.WritableStream();
});

afterEach(() => {
  mock.restore();
});

describe('normal ops', () => {
  test('test input without errors - from file', async () => {
    const t = createTestIncludioProcessor(DEFAULT_INCLUDIO_OPTIONS);

    await t.lineMachine('ok-file.txt', output);

    const result = output.toString();

    expect(result).toEqual('');
    expect(t.getErrorCount()).toEqual(0);
  });

  test('test input that contains errors - from file', async () => {
    const t = createTestIncludioProcessor(DEFAULT_INCLUDIO_OPTIONS);

    await t.lineMachine('error-file.txt', output);

    const result = output.toString();

    expect(result).toContain('"error-file.txt:2" ;');
    expect(result).toContain('"error-file.txt:4" ;');
    expect(t.getErrorCount()).toEqual(2);
  });

  test('test input that contains errors - from stream', async () => {
    const t = createTestIncludioProcessor(DEFAULT_INCLUDIO_OPTIONS);

    const input = fs.createReadStream('error-file.txt');
    await t.lineMachine(input, output);

    const result = output.toString();

    expect(result).toContain('"" ;');
    expect(result).toContain('"" ;');
    expect(t.getErrorCount()).toEqual(2);
  });
});

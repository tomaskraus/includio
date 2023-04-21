import mock from 'mock-fs';

import {
  createListIncludioProcessor,
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

    'source1.txt': 'text1 \n //< part1 \n m1 line1 \nm1 line2\n//< \ntext',
  });
  mock.file();

  output = new mStream.WritableStream();
});

afterEach(() => {
  mock.restore();
});

describe('normal ops', () => {
  test('test input that contains directives - from file', async () => {
    const t = createListIncludioProcessor(DEFAULT_INCLUDIO_OPTIONS).lineMachine;

    await t('error-file.txt', output);

    const result = output.toString().split('\n');

    expect(result[0]).toContain('"error-file.txt:2"');
    expect(result[0]).toContain('nonexistent.txt');
    expect(result[1]).toContain('"error-file.txt:4"');
    expect(result[1]).toContain('source1.txt : p1');
    expect(result[2]).toContain('"error-file.txt:5"');
    expect(result[2]).toContain('source1.txt');
  });

  test('test input that contains directives - from stream', async () => {
    const t = createListIncludioProcessor(DEFAULT_INCLUDIO_OPTIONS).lineMachine;

    const input = fs.createReadStream('error-file.txt');
    await t(input, output);

    const result = output.toString().split('\n');

    expect(result[0]).toContain('nonexistent.txt');
    expect(result[1]).toContain('source1.txt : p1');
    expect(result[2]).toContain('source1.txt');
  });
});

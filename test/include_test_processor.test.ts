import mock from 'mock-fs';

import {
  createTestIncludoProcessor,
  DEFAULT_INCLUDO_OPTIONS,
} from '../src/core/includo';
import stream from 'stream';

import * as mStream from 'memory-streams';

let output: stream.Writable;

beforeEach(() => {
  mock({
    'error-file.txt':
      'Hello, \n@@ nonexistent.txt \nWorld!\n@@ source1.txt : p1',

    'source1.txt': 'text1 \n //< part1 \n m1 line1 \nm1 line2\n//< \ntext',
  });
  mock.file();

  output = new mStream.WritableStream();
});

afterEach(() => {
  mock.restore();
});

describe('normal ops', () => {
  test('test input that contains errors', async () => {
    const t = createTestIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);

    await t('error-file.txt', output);

    const result = output.toString();

    expect(result).toContain('error-file.txt:2');
    expect(result).toContain('error-file.txt:4');
  });
});

import mock from 'mock-fs';

import {createIncludoProcessor, DEFAULT_INCLUDO_OPTIONS} from '../src/includo';
import stream from 'stream';

import * as mStream from 'memory-streams';

let output: stream.Writable;

beforeEach(() => {
  mock({
    'part-valid-exists.txt': 'Hello, \n@@ source1.txt : part1 \nWorld!\n',
    'part-valid-exists-empty-content.txt':
      'Hello, \n@@ source-empty-content-part.txt : part1 \nWorld!\n',
    'part-empty.txt': 'Hello, \n@@ source1.txt :  \nWorld!\n',
    'part-more-at-once.txt':
      'Hello, \n@@ source1.txt : part1 : part2 \nWorld!\n',
    'part-valid-exists-source-with-empty-part-name.txt':
      'Hello, \n@@ source-part-without-name.txt : part1 \nWorld!\n',
    'part-valid-source-with-no-parts.txt':
      'Hello, \n@@ source-with-no-parts.txt : part1 \nWorld!\n',
    'part-valid-exists-quoted-file.txt':
      'Hello, \n@@ "source 1.txt" : part1 \nWorld!\n',
    'part-valid-nonexistent.txt':
      'Hello, \none\n@@ source1.txt : nonexistentpart \nWorld!',
    'part-invalid.txt':
      'Hello, \na second\n@@ source1.txt : *invalidpart \nWorld!',
    'part-valid-source-part-invalid.txt':
      'Hello, \na second\n@@ source-invalid-part-name.txt : part1 \nWorld!',
    'tag-nonexistent-file-name.txt':
      'Hello, \n@@ nonexistentfile.txt : part1 \nWorld!',

    'source1.txt': 'text1 \n //< part1 \n m1 line1 \nm1 line2\n//< \ntext2',
    'source 1.txt': 'text1 \n //< part1 \n m1 line1 \nm1 line2\n//< \ntext2',
    'source-empty-content-part.txt':
      'text1 \n //< part1\n//< \ntext2 \n //< part2 \n m1 line1 \nm1 line2\n//< ',
    'source-part-without-name.txt':
      'text1 \n //< part1 \n m1 line1 \nm1 line2\n//< \ntext2 //< \n abc\n//<',
    'source-invalid-part-name.txt':
      'text1 \n //< part1 \n m1 line1 \nm1 line2\n//< \ntext2 \n//< inv alid part \n abc\n//<',
    'source-with-no-parts.txt': 'text1 \n \ntext2 ',
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
  test('valid existent part name', async () => {
    const p = createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);

    const res = await p('part-valid-exists.txt', output);
    expect(res.lineNumber).toEqual(4);
    expect(output.toString()).toEqual(
      'Hello, \n m1 line1 \nm1 line2\nWorld!\n'
    );
  });

  test('valid existent part name, quoted file name', async () => {
    const p = createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);

    const res = await p('part-valid-exists-quoted-file.txt', output);
    expect(res.lineNumber).toEqual(4);
    expect(output.toString()).toEqual(
      'Hello, \n m1 line1 \nm1 line2\nWorld!\n'
    );
  });

  test('valid existent part name, empty part content - inserts empty line', async () => {
    const p = createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);

    const res = await p('part-valid-exists-empty-content.txt', output);
    expect(res.lineNumber).toEqual(4);
    expect(output.toString()).toEqual('Hello, \n\nWorld!\n');
  });

  test('empty part name in source file - processes without error', async () => {
    const p = createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);

    const res = await p(
      'part-valid-exists-source-with-empty-part-name.txt',
      output
    );
    expect(res.lineNumber).toEqual(4);
    expect(output.toString()).toEqual(
      'Hello, \n m1 line1 \nm1 line2\nWorld!\n'
    );
  });
});

describe('error handling', () => {
  test('nonexistent part name', async () => {
    expect.assertions(3);
    const p = createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);
    try {
      await p('part-valid-nonexistent.txt', output);
    } catch (e) {
      expect((e as Error).message).toContain('part-valid-nonexistent.txt:3'); //file&line info
      expect((e as Error).message).toContain(
        '@@ source1.txt : nonexistentpart '
      ); //line
      expect((e as Error).message).toContain('[nonexistentpart] not found'); //err
    }
  });

  test('empty part name', async () => {
    expect.assertions(3);
    const p = createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);
    try {
      await p('part-empty.txt', output);
    } catch (e) {
      expect((e as Error).message).toContain('part-empty.txt:2'); //file&line info
      expect((e as Error).message).toContain('@@ source1.txt :  '); //line
      expect((e as Error).message).toContain('Invalid part name'); //err
    }
  });

  test('invalid part name (contains forbidden characters)', async () => {
    expect.assertions(4);
    const p = createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);
    try {
      await p('part-valid-source-part-invalid.txt', output);
    } catch (e) {
      expect((e as Error).message).toContain(
        'part-valid-source-part-invalid.txt:3'
      ); //file&line info
      expect((e as Error).message).toContain(
        '@@ source-invalid-part-name.txt : part1 '
      ); //line
      expect((e as Error).message).toContain('Invalid part name'); //err
      expect((e as Error).message).toContain('[inv alid part]'); //err
    }
  });

  test('use part from file that contains no parts', async () => {
    expect.assertions(3);
    const p = createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);
    try {
      await p('part-valid-source-with-no-parts.txt', output);
    } catch (e) {
      expect((e as Error).message).toContain(
        'part-valid-source-with-no-parts.txt:2'
      ); //file&line info
      expect((e as Error).message).toContain(
        '@@ source-with-no-parts.txt : part1 '
      ); //line
      expect((e as Error).message).toContain('No parts found'); //err
    }
  });

  test('use part from file that contains no parts. Custom resourceDir', async () => {
    expect.assertions(4);
    const p = createIncludoProcessor({resourceDir: 'dir-for-insert'});
    try {
      await p('part-valid-source-with-no-parts.txt', output);
    } catch (e) {
      expect((e as Error).message).toContain(
        'part-valid-source-with-no-parts.txt:2'
      ); //file&line info
      expect((e as Error).message).toContain(
        '@@ source-with-no-parts.txt : part1 '
      ); //line
      expect((e as Error).message).toContain('No parts found'); //err
      expect((e as Error).message).toContain(
        'dir-for-insert/source-with-no-parts.txt'
      ); //contains resourceDir in file path
    }
  });

  test('invalid part name in input file', async () => {
    expect.assertions(3);
    const p = createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);
    try {
      await p('part-invalid.txt', output);
    } catch (e) {
      expect((e as Error).message).toContain('part-invalid.txt:3'); //file&line info
      expect((e as Error).message).toContain('@@ source1.txt : *invalidpart '); //line
      expect((e as Error).message).toContain('Invalid part name'); //err
    }
  });

  test('more parts at once', async () => {
    expect.assertions(3);
    const p = createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);
    try {
      await p('part-more-at-once.txt', output);
    } catch (e) {
      expect((e as Error).message).toContain('part-more-at-once.txt:2'); //file&line info
      expect((e as Error).message).toContain('@@ source1.txt : part1 : part2'); //line
      expect((e as Error).message).toContain('Only one part allowed'); //err
    }
  });

  test('Non-existent file for insertion', async () => {
    expect.assertions(3);
    const p = createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);
    try {
      await p('tag-nonexistent-file-name.txt', output);
    } catch (e) {
      expect((e as Error).message).toContain('tag-nonexistent-file-name.txt:2'); //file&line info
      expect((e as Error).message).toContain('@@ nonexistentfile.txt '); //line
      expect((e as Error).message).toContain('ENOENT'); //err
    }
  });

  test('Non-existent resourceDir', async () => {
    expect.assertions(4);
    const p = createIncludoProcessor({resourceDir: 'abc'});
    try {
      await p('part-valid-exists.txt', output);
    } catch (e) {
      expect((e as Error).message).toContain('part-valid-exists.txt'); //file&line info
      expect((e as Error).message).toContain('@@ source1.txt '); //line
      expect((e as Error).message).toContain('ENOENT'); //err
      expect((e as Error).message).toContain('abc/source1.txt'); //err - file info
    }
  });
});

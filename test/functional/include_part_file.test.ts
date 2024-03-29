import mock from 'mock-fs';

import {
  createIncludioProcessor,
  DEFAULT_INCLUDIO_OPTIONS,
} from '../../src/core/includio';
import stream from 'stream';

import * as mStream from 'memory-streams';
import {LineMachineError} from 'line-transform-machines';

let output: stream.Writable;

beforeEach(() => {
  mock({
    'part-valid-exists.txt': 'Hello, \n@@ source1.txt : part-1 \nWorld!\n',
    'part-valid-exists-html.txt':
      'Hello, \n@@ source1.html : part-1 \nWorld!\n',
    'part-valid-exists-empty-content.txt':
      'Hello, \n@@ source-empty-content-part.txt : part1 \nWorld!\n',
    'part-empty.txt': 'Hello, \n@@ source1.txt :  \nWorld!\n',
    'part-more-text-after-partname.txt':
      'Hello, \n@@ source1.txt : part-1 some text >> \nWorld!\n',
    'part-more-text-after-partname-in-source.txt':
      'Hello, \n@@ source1-text-after-part-name.txt : part1  \nWorld!\n',
    'part-more-at-once.txt':
      'Hello, \n@@ source1.txt : part-1 : part2 \nWorld!\n',
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
    'part-valid-source-part-duplicit.txt':
      'Hello, \na second\n@@ source-duplicit-part-name.txt : p2 \nWorld!',
    'part-nonexistent-file-name.txt':
      'Hello, \n@@ nonexistentfile.txt : part1 \nWorld!',

    'source1.txt': 'text1 \n //< part-1 \n m1 line1 \nm1 line2\n//< \ntext2',
    'source1.html':
      'text1 \n <!--< part-1 --> \n m1 line1 \nm1 line2\n<!--< -->\ntext2',
    'source1-text-after-part-name.txt':
      'text1 \n //< part1 text> \n m1 line1 \nm1 line2\n//< \ntext2',
    'source 1.txt': 'text1 \n //< part1 \n m1 line1 \nm1 line2\n//< \ntext2',
    'source-empty-content-part.txt':
      'text1 \n //< part1\n//< \ntext2 \n //< part2 \n m1 line1 \nm1 line2\n//< ',
    'source-part-without-name.txt':
      'text1 \n //< part1 \n m1 line1 \nm1 line2\n//< \ntext2 //< \n abc\n//<',
    'source-invalid-part-name.txt':
      'text1 \n //< part1 \n m1 line1 \nm1 line2\n//< \ntext2 \n//< inv*alid*part \n abc\n//<',
    'source-duplicit-part-name.txt':
      'text1 \n //< part1 \n m1 line1 \n//< p2 \n line2\n//< \ntext2 \n//< part1 \n abc\n//<',
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
    const p = createIncludioProcessor(DEFAULT_INCLUDIO_OPTIONS).lineMachine;

    const res = await p('part-valid-exists.txt', output);
    expect(res.lineNumber).toEqual(4);
    expect(output.toString()).toEqual(
      'Hello, \n m1 line1 \nm1 line2\nWorld!\n'
    );
  });

  test('valid existent part name - resource with pair marks', async () => {
    const p = createIncludioProcessor(DEFAULT_INCLUDIO_OPTIONS).lineMachine;
    const res = await p('part-valid-exists-html.txt', output);
    expect(res.lineNumber).toEqual(4);
    expect(output.toString()).toEqual(
      'Hello, \n m1 line1 \nm1 line2\nWorld!\n'
    );
  });

  test('valid existent part name, quoted file name', async () => {
    const p = createIncludioProcessor(DEFAULT_INCLUDIO_OPTIONS).lineMachine;

    const res = await p('part-valid-exists-quoted-file.txt', output);
    expect(res.lineNumber).toEqual(4);
    expect(output.toString()).toEqual(
      'Hello, \n m1 line1 \nm1 line2\nWorld!\n'
    );
  });

  test('more text after part name in input', async () => {
    const p = createIncludioProcessor(DEFAULT_INCLUDIO_OPTIONS).lineMachine;
    const res = await p('part-more-text-after-partname.txt', output);
    expect(res.lineNumber).toEqual(4);
    expect(output.toString()).toEqual(
      'Hello, \n m1 line1 \nm1 line2\nWorld!\n'
    );
  });

  test('more text after part name in source file', async () => {
    const p = createIncludioProcessor(DEFAULT_INCLUDIO_OPTIONS).lineMachine;
    const res = await p('part-more-text-after-partname-in-source.txt', output);
    expect(res.lineNumber).toEqual(4);
    expect(output.toString()).toEqual(
      'Hello, \n m1 line1 \nm1 line2\nWorld!\n'
    );
  });

  test('valid existent part name, empty part content - inserts empty line', async () => {
    const p = createIncludioProcessor(DEFAULT_INCLUDIO_OPTIONS).lineMachine;

    const res = await p('part-valid-exists-empty-content.txt', output);
    expect(res.lineNumber).toEqual(4);
    expect(output.toString()).toEqual('Hello, \n\nWorld!\n');
  });

  test('empty part name in source file - processes without error', async () => {
    const p = createIncludioProcessor(DEFAULT_INCLUDIO_OPTIONS).lineMachine;

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
    expect.assertions(2);
    const p = createIncludioProcessor(DEFAULT_INCLUDIO_OPTIONS).lineMachine;
    try {
      await p('part-valid-nonexistent.txt', output);
    } catch (e) {
      expect(e).toBeInstanceOf(LineMachineError);
      expect((e as LineMachineError).message).toContain(
        '(nonexistentpart) not found'
      ); //err
    }
  });

  test('empty part name', async () => {
    expect.assertions(2);
    const p = createIncludioProcessor(DEFAULT_INCLUDIO_OPTIONS).lineMachine;
    try {
      await p('part-empty.txt', output);
    } catch (e) {
      expect(e).toBeInstanceOf(LineMachineError);
      expect((e as LineMachineError).message).toContain('invalid value'); //err
    }
  });

  test('invalid part name in resource file (contains forbidden characters)', async () => {
    expect.assertions(4);
    const p = createIncludioProcessor(DEFAULT_INCLUDIO_OPTIONS).lineMachine;
    try {
      await p('part-valid-source-part-invalid.txt', output);
    } catch (e) {
      expect(e).toBeInstanceOf(LineMachineError);
      expect((e as LineMachineError).message).toContain('invalid value'); //err
      expect((e as LineMachineError).message).toContain('(inv*alid*part)'); //err
      expect((e as LineMachineError).message).toContain(
        'source-invalid-part-name.txt:7'
      ); //err
    }
  });

  test('duplicit part name in resource file (contains forbidden characters)', async () => {
    expect.assertions(4);
    const p = createIncludioProcessor(DEFAULT_INCLUDIO_OPTIONS).lineMachine;
    try {
      await p('part-valid-source-part-duplicit.txt', output);
    } catch (e) {
      expect(e).toBeInstanceOf(LineMachineError);
      expect((e as LineMachineError).message).toContain('Duplicit part name'); //err
      expect((e as LineMachineError).message).toContain('(part1)'); //err
      expect((e as LineMachineError).message).toContain(
        'source-duplicit-part-name.txt:8'
      ); //err
    }
  });

  test('use part from file that contains no parts', async () => {
    expect.assertions(2);
    const p = createIncludioProcessor(DEFAULT_INCLUDIO_OPTIONS).lineMachine;
    try {
      await p('part-valid-source-with-no-parts.txt', output);
    } catch (e) {
      expect(e).toBeInstanceOf(LineMachineError);
      expect((e as LineMachineError).message).toContain('No parts found'); //err
    }
  });

  test('use part from file that contains no parts. Custom resourceDir', async () => {
    expect.assertions(2);
    const p = createIncludioProcessor({
      resourceDir: 'dir-for-insert',
    }).lineMachine;
    try {
      await p('part-valid-source-with-no-parts.txt', output);
    } catch (e) {
      expect(e).toBeInstanceOf(LineMachineError);
      expect((e as LineMachineError).message).toContain('No parts found'); //err
    }
  });

  test('invalid part name in input file', async () => {
    expect.assertions(2);
    const p = createIncludioProcessor(DEFAULT_INCLUDIO_OPTIONS).lineMachine;
    try {
      await p('part-invalid.txt', output);
    } catch (e) {
      expect(e).toBeInstanceOf(LineMachineError);
      expect((e as LineMachineError).message).toContain('*invalidpart'); //err
    }
  });

  test('Non-existent file for insertion', async () => {
    expect.assertions(2);
    const p = createIncludioProcessor(DEFAULT_INCLUDIO_OPTIONS).lineMachine;
    try {
      await p('part-nonexistent-file-name.txt', output);
    } catch (e) {
      expect(e).toBeInstanceOf(LineMachineError);
      expect((e as LineMachineError).message).toContain('ENOENT'); //err
    }
  });

  test('Non-existent resourceDir', async () => {
    expect.assertions(3);
    const p = createIncludioProcessor({resourceDir: 'abc'}).lineMachine;
    try {
      await p('part-valid-exists.txt', output);
    } catch (e) {
      expect(e).toBeInstanceOf(LineMachineError);
      expect((e as LineMachineError).message).toContain('ENOENT'); //err
      expect((e as LineMachineError).message).toContain('abc/source1.txt'); //err - file info
    }
  });

  test('more parts at once', async () => {
    expect.assertions(2);
    const p = createIncludioProcessor(DEFAULT_INCLUDIO_OPTIONS).lineMachine;
    try {
      await p('part-more-at-once.txt', output);
    } catch (e) {
      expect(e).toBeInstanceOf(LineMachineError);
      expect((e as LineMachineError).message).toContain(
        'Only one part allowed'
      ); //err
    }
  });
});

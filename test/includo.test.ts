import mock from 'mock-fs';

import {createIncludoProcessor, DEFAULT_INCLUDO_OPTIONS} from '../src/includo';
import stream from 'stream';

import * as mStream from 'memory-streams';
import * as fs from 'fs';

let input: stream.Readable;
let output: stream.Writable;
beforeEach(() => {});

beforeEach(() => {
  mock({
    'empty-file.txt': '',
    'no-tag-file.txt': 'Hello, \nWorld!',
    'my-file.txt': 'Hello, \n@@ id\nWorld!',
  });
  mock.file();

  input = fs.createReadStream('my-file.txt');
  output = new mStream.WritableStream();
});
const PATH_PREFIX = './my-dir';

afterEach(() => {
  mock.restore();
});

// describe('transform', () => {
//   const lineNumberFn: TLineCallback = (
//     line: string,
//     lineNumber: number
//   ): string => {
//     return `${lineNumber}: ${line}`;
//   };

//   const noDollyFn: TLineCallback = (line: string) => {
//     if (line.trim() === 'Dolly') {
//       return null;
//     }
//     return line;
//   };

//   test('line numbers', async () => {
//     const lnMachine = createLineMachine(lineNumberFn);

//     const res = await lnMachine(input, output);

//     expect(res.lineNumber).toEqual(2);
//     expect(output.toString()).toEqual('1: Hello, \n2: World!');
//   });

//   test('outputs less lines if fn returns null', async () => {
//     const inputWithDolly = fs.createReadStream(`${PATH_PREFIX}/dolly-text.txt`);

//     const lnMachine = createLineMachine(noDollyFn);

//     const res = await lnMachine(inputWithDolly, output);

//     expect(res.lineNumber).toEqual(4); //line read count remains the same
//     expect(output.toString()).toEqual('hello\n nwelcome \n');
//   });

//   test('outputs more lines if fn returns a string with newLine(s)', async () => {
//     const nlFn: TLineCallback = (line: string) => `-\n${line}`;

//     const lnMachine = createLineMachine(nlFn);

//     const res = await lnMachine(input, output);
//     expect(res.lineNumber).toEqual(2); //line read count remains the same
//     expect(output.toString()).toEqual('-\nHello, \n-\nWorld!');
//   });
// });

describe('error handling', () => {
  test('Include line value, file name & line number and Error message', async () => {
    expect.assertions(3);
    const process = createIncludoProcessor(DEFAULT_INCLUDO_OPTIONS);
    try {
      await process('my-file.txt', 'out.txt');
    } catch (e) {
      expect((e as Error).message).toContain('my-file.txt:2'); //file&line info
      expect((e as Error).message).toContain('@@ id'); //line
      expect((e as Error).message).toContain('EEE!'); //err
    }
  });
});

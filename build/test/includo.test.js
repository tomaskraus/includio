"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mock_fs_1 = __importDefault(require("mock-fs"));
const includo_1 = require("../src/includo");
const mStream = __importStar(require("memory-streams"));
const fs = __importStar(require("fs"));
let input;
let output;
beforeEach(() => { });
beforeEach(() => {
    (0, mock_fs_1.default)({
        'empty-file.txt': '',
        'no-tag-file.txt': 'Hello, \nWorld!',
        'my-file.txt': 'Hello, \n@@ id\nWorld!',
    });
    mock_fs_1.default.file();
    input = fs.createReadStream('my-file.txt');
    output = new mStream.WritableStream();
});
const PATH_PREFIX = './my-dir';
afterEach(() => {
    mock_fs_1.default.restore();
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
        const process = (0, includo_1.createIncludoProcessor)(includo_1.DEFAULT_INCLUDO_OPTIONS);
        try {
            await process('my-file.txt', 'out.txt');
        }
        catch (e) {
            expect(e.message).toContain('my-file.txt:2'); //file&line info
            expect(e.message).toContain('@@ id'); //line
            expect(e.message).toContain('EEE!'); //err
        }
    });
});
//# sourceMappingURL=includo.test.js.map
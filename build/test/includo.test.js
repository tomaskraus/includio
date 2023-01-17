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
// import * as fs from 'fs';
// let input: stream.Readable;
let output;
beforeEach(() => {
    (0, mock_fs_1.default)({
        'empty-file.txt': '',
        'no-tag-file.txt': 'Hello, \nWorld!',
        'my-file.txt': 'Hello, \n@@ id\nWorld!\n',
        'error-file.txt': 'Hello, \n@@  \nWorld!',
    });
    mock_fs_1.default.file();
    // input = fs.createReadStream('my-file.txt');
    output = new mStream.WritableStream();
});
afterEach(() => {
    mock_fs_1.default.restore();
});
describe('normal ops', () => {
    test('empty input', async () => {
        const p = (0, includo_1.createIncludoProcessor)(includo_1.DEFAULT_INCLUDO_OPTIONS);
        const res = await p('empty-file.txt', output);
        expect(res.lineNumber).toEqual(0);
        expect(output.toString()).toEqual('');
    });
    test('input without tags', async () => {
        const p = (0, includo_1.createIncludoProcessor)(includo_1.DEFAULT_INCLUDO_OPTIONS);
        const res = await p('no-tag-file.txt', output);
        expect(res.lineNumber).toEqual(2);
        expect(output.toString()).toEqual('Hello, \nWorld!');
    });
    test('input with tags', async () => {
        const p = (0, includo_1.createIncludoProcessor)(includo_1.DEFAULT_INCLUDO_OPTIONS);
        const res = await p('my-file.txt', output);
        expect(res.lineNumber).toEqual(4);
        expect(output.toString()).toEqual('Hello, \n--insertion--\nWorld!\n');
    });
});
describe('error handling', () => {
    test('Nonexistent input file', async () => {
        expect.assertions(1);
        const p = (0, includo_1.createIncludoProcessor)(includo_1.DEFAULT_INCLUDO_OPTIONS);
        try {
            await p('non-existent-file.txt', output);
        }
        catch (e) {
            expect(e.message).toContain('ENOENT'); //file&line info
        }
    });
    test('Include line value, file name & line number and Error message', async () => {
        expect.assertions(3);
        const p = (0, includo_1.createIncludoProcessor)(includo_1.DEFAULT_INCLUDO_OPTIONS);
        try {
            await p('error-file.txt', output);
        }
        catch (e) {
            expect(e.message).toContain('error-file.txt:2'); //file&line info
            expect(e.message).toContain('@@'); //line
            expect(e.message).toContain('empty'); //err
        }
    });
});
//# sourceMappingURL=includo.test.js.map
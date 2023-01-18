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
        'mark-valid-exists.txt': 'Hello, \n@@ source1.txt mark1 \nWorld!\n',
        'mark-valid-exists-quoted-file.txt': 'Hello, \n@@ "source 1.txt" mark1 \nWorld!\n',
        'mark-valid-nonexistent.txt': 'Hello, \none\n@@ source1.txt nonexistentMark \nWorld!',
        'mark-invalid.txt': 'Hello, \na second\n@@ source1.txt *invalidMark \nWorld!',
        'tag-nonexistent-file-name.txt': 'Hello, \n@@ nonexistentfile.txt mark1 \nWorld!',
        'source1.txt': 'text1 \n //< mark1 \n m1 line1 \nm1 line2\n//> \ntext2',
        'source 1.txt': 'text1 \n //< mark1 \n m1 line1 \nm1 line2\n//> \ntext2',
    });
    mock_fs_1.default.file();
    // input = fs.createReadStream('my-file.txt');
    output = new mStream.WritableStream();
});
afterEach(() => {
    mock_fs_1.default.restore();
});
describe('normal ops', () => {
    test('valid existent mark name', async () => {
        const p = (0, includo_1.createIncludoProcessor)(includo_1.DEFAULT_INCLUDO_OPTIONS);
        const res = await p('mark-valid-exists.txt', output);
        expect(res.lineNumber).toEqual(4);
        expect(output.toString()).toEqual('Hello, \n m1 line1 \nm1 line2\nWorld!\n');
    });
    test('valid existent mark name, quoted file name', async () => {
        const p = (0, includo_1.createIncludoProcessor)(includo_1.DEFAULT_INCLUDO_OPTIONS);
        const res = await p('mark-valid-exists-quoted-file.txt', output);
        expect(res.lineNumber).toEqual(4);
        expect(output.toString()).toEqual('Hello, \n m1 line1 \nm1 line2\nWorld!\n');
    });
});
describe('error handling', () => {
    test('nonexistent mark name', async () => {
        expect.assertions(3);
        const p = (0, includo_1.createIncludoProcessor)(includo_1.DEFAULT_INCLUDO_OPTIONS);
        try {
            await p('mark-valid-nonexistent.txt', output);
        }
        catch (e) {
            expect(e.message).toContain('mark-valid-nonexistent.txt:3'); //file&line info
            expect(e.message).toContain('@@ source1.txt nonexistentMark '); //line
            expect(e.message).toContain('[nonexistentMark] not found'); //err
        }
    });
    test('Non-existent file for insertion', async () => {
        expect.assertions(3);
        const p = (0, includo_1.createIncludoProcessor)(includo_1.DEFAULT_INCLUDO_OPTIONS);
        try {
            await p('tag-nonexistent-file-name.txt', output);
        }
        catch (e) {
            expect(e.message).toContain('tag-nonexistent-file-name.txt:2'); //file&line info
            expect(e.message).toContain('@@ nonexistentfile.txt '); //line
            expect(e.message).toContain('ENOENT'); //err
        }
    });
    test('Non-existent baseDir', async () => {
        expect.assertions(4);
        const p = (0, includo_1.createIncludoProcessor)({ baseDir: 'abc' });
        try {
            await p('mark-valid-exists.txt', output);
        }
        catch (e) {
            expect(e.message).toContain('mark-valid-exists.txt'); //file&line info
            expect(e.message).toContain('@@ source1.txt '); //line
            expect(e.message).toContain('ENOENT'); //err
            expect(e.message).toContain('abc/source1.txt'); //err - file info
        }
    });
});
//# sourceMappingURL=include_part_file_mark.test.js.map
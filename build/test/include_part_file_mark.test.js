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
let output;
beforeEach(() => {
    (0, mock_fs_1.default)({
        'part-valid-exists.txt': 'Hello, \n@@ source1.txt part: part1 \nWorld!\n',
        'part-valid-exists-empty-content.txt': 'Hello, \n@@ source-empty-content-part.txt part: part1 \nWorld!\n',
        'part-empty.txt': 'Hello, \n@@ source1.txt part:  \nWorld!\n',
        'part-valid-exists-source-with-empty-part-name.txt': 'Hello, \n@@ source-part-without-name.txt part: part1 \nWorld!\n',
        'part-valid-source-with-no-parts.txt': 'Hello, \n@@ source-with-no-parts.txt part: part1 \nWorld!\n',
        'part-valid-exists-quoted-file.txt': 'Hello, \n@@ "source 1.txt" part: part1 \nWorld!\n',
        'part-valid-nonexistent.txt': 'Hello, \none\n@@ source1.txt part: nonexistentpart \nWorld!',
        'part-invalid.txt': 'Hello, \na second\n@@ source1.txt part: *invalidpart \nWorld!',
        'part-valid-source-part-invalid.txt': 'Hello, \na second\n@@ source-invalid-part-name.txt part: part1 \nWorld!',
        'tag-nonexistent-file-name.txt': 'Hello, \n@@ nonexistentfile.txt part: part1 \nWorld!',
        'source1.txt': 'text1 \n //< part1 \n m1 line1 \nm1 line2\n//< \ntext2',
        'source 1.txt': 'text1 \n //< part1 \n m1 line1 \nm1 line2\n//< \ntext2',
        'source-empty-content-part.txt': 'text1 \n //< part1\n//< \ntext2 \n //< part2 \n m1 line1 \nm1 line2\n//< ',
        'source-part-without-name.txt': 'text1 \n //< part1 \n m1 line1 \nm1 line2\n//< \ntext2 //< \n abc\n//<',
        'source-invalid-part-name.txt': 'text1 \n //< part1 \n m1 line1 \nm1 line2\n//< \ntext2 \n//< inv alid part \n abc\n//<',
        'source-with-no-parts.txt': 'text1 \n \ntext2 ',
        'dir-for-insert': {
            'source-with-no-parts.txt': 'text1 \n \ntext2 ',
        },
    });
    mock_fs_1.default.file();
    output = new mStream.WritableStream();
});
afterEach(() => {
    mock_fs_1.default.restore();
});
describe('normal ops', () => {
    test('valid existent part name', async () => {
        const p = (0, includo_1.createIncludoProcessor)(includo_1.DEFAULT_INCLUDO_OPTIONS);
        const res = await p('part-valid-exists.txt', output);
        expect(res.lineNumber).toEqual(4);
        expect(output.toString()).toEqual('Hello, \n m1 line1 \nm1 line2\nWorld!\n');
    });
    test('valid existent part name, quoted file name', async () => {
        const p = (0, includo_1.createIncludoProcessor)(includo_1.DEFAULT_INCLUDO_OPTIONS);
        const res = await p('part-valid-exists-quoted-file.txt', output);
        expect(res.lineNumber).toEqual(4);
        expect(output.toString()).toEqual('Hello, \n m1 line1 \nm1 line2\nWorld!\n');
    });
    test('valid existent part name, empty part content - inserts empty line', async () => {
        const p = (0, includo_1.createIncludoProcessor)(includo_1.DEFAULT_INCLUDO_OPTIONS);
        const res = await p('part-valid-exists-empty-content.txt', output);
        expect(res.lineNumber).toEqual(4);
        expect(output.toString()).toEqual('Hello, \n\nWorld!\n');
    });
    test('empty part name in source file - processes without error', async () => {
        const p = (0, includo_1.createIncludoProcessor)(includo_1.DEFAULT_INCLUDO_OPTIONS);
        const res = await p('part-valid-exists-source-with-empty-part-name.txt', output);
        expect(res.lineNumber).toEqual(4);
        expect(output.toString()).toEqual('Hello, \n m1 line1 \nm1 line2\nWorld!\n');
    });
});
describe('error handling', () => {
    test('nonexistent part name', async () => {
        expect.assertions(3);
        const p = (0, includo_1.createIncludoProcessor)(includo_1.DEFAULT_INCLUDO_OPTIONS);
        try {
            await p('part-valid-nonexistent.txt', output);
        }
        catch (e) {
            expect(e.message).toContain('part-valid-nonexistent.txt:3'); //file&line info
            expect(e.message).toContain('@@ source1.txt part: nonexistentpart '); //line
            expect(e.message).toContain('[nonexistentpart] not found'); //err
        }
    });
    test('empty part name', async () => {
        expect.assertions(3);
        const p = (0, includo_1.createIncludoProcessor)(includo_1.DEFAULT_INCLUDO_OPTIONS);
        try {
            await p('part-empty.txt', output);
        }
        catch (e) {
            expect(e.message).toContain('part-empty.txt:2'); //file&line info
            expect(e.message).toContain('@@ source1.txt part:  '); //line
            expect(e.message).toContain('Invalid part name'); //err
        }
    });
    test('invalid part name (contains forbidden characters)', async () => {
        expect.assertions(4);
        const p = (0, includo_1.createIncludoProcessor)(includo_1.DEFAULT_INCLUDO_OPTIONS);
        try {
            await p('part-valid-source-part-invalid.txt', output);
        }
        catch (e) {
            expect(e.message).toContain('part-valid-source-part-invalid.txt:3'); //file&line info
            expect(e.message).toContain('@@ source-invalid-part-name.txt part: part1 '); //line
            expect(e.message).toContain('Invalid part name'); //err
            expect(e.message).toContain('[inv alid part]'); //err
        }
    });
    test('use part from file that contains no parts', async () => {
        expect.assertions(3);
        const p = (0, includo_1.createIncludoProcessor)(includo_1.DEFAULT_INCLUDO_OPTIONS);
        try {
            await p('part-valid-source-with-no-parts.txt', output);
        }
        catch (e) {
            expect(e.message).toContain('part-valid-source-with-no-parts.txt:2'); //file&line info
            expect(e.message).toContain('@@ source-with-no-parts.txt part: part1 '); //line
            expect(e.message).toContain('No parts found'); //err
        }
    });
    test('use part from file that contains no parts. Custom BaseDir', async () => {
        expect.assertions(4);
        const p = (0, includo_1.createIncludoProcessor)({ resourceDir: 'dir-for-insert' });
        try {
            await p('part-valid-source-with-no-parts.txt', output);
        }
        catch (e) {
            expect(e.message).toContain('part-valid-source-with-no-parts.txt:2'); //file&line info
            expect(e.message).toContain('@@ source-with-no-parts.txt part: part1 '); //line
            expect(e.message).toContain('No parts found'); //err
            expect(e.message).toContain('dir-for-insert/source-with-no-parts.txt'); //contains resourceDir in file path
        }
    });
    test('invalid part name in input file', async () => {
        expect.assertions(3);
        const p = (0, includo_1.createIncludoProcessor)(includo_1.DEFAULT_INCLUDO_OPTIONS);
        try {
            await p('part-invalid.txt', output);
        }
        catch (e) {
            expect(e.message).toContain('part-invalid.txt:3'); //file&line info
            expect(e.message).toContain('@@ source1.txt part: *invalidpart '); //line
            expect(e.message).toContain('Invalid part name'); //err
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
    test('Non-existent resourceDir', async () => {
        expect.assertions(4);
        const p = (0, includo_1.createIncludoProcessor)({ resourceDir: 'abc' });
        try {
            await p('part-valid-exists.txt', output);
        }
        catch (e) {
            expect(e.message).toContain('part-valid-exists.txt'); //file&line info
            expect(e.message).toContain('@@ source1.txt '); //line
            expect(e.message).toContain('ENOENT'); //err
            expect(e.message).toContain('abc/source1.txt'); //err - file info
        }
    });
});
//# sourceMappingURL=include_part_file_mark.test.js.map
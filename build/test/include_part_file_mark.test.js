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
        'mark-valid-exists.txt': 'Hello, \n@@ source1.txt mark1 \nWorld!\n',
        'mark-valid-exists-empty-content.txt': 'Hello, \n@@ source-empty-content-mark.txt mark1 \nWorld!\n',
        'mark-valid-exists-source-with-empty-mark-name.txt': 'Hello, \n@@ source-mark-without-name.txt mark1 \nWorld!\n',
        'mark-valid-source-with-no-marks.txt': 'Hello, \n@@ source-with-no-marks.txt mark1 \nWorld!\n',
        'mark-valid-exists-quoted-file.txt': 'Hello, \n@@ "source 1.txt" mark1 \nWorld!\n',
        'mark-valid-nonexistent.txt': 'Hello, \none\n@@ source1.txt nonexistentMark \nWorld!',
        'mark-invalid.txt': 'Hello, \na second\n@@ source1.txt *invalidMark \nWorld!',
        'mark-valid-source-mark-invalid.txt': 'Hello, \na second\n@@ source-invalid-mark-name.txt mark1 \nWorld!',
        'tag-nonexistent-file-name.txt': 'Hello, \n@@ nonexistentfile.txt mark1 \nWorld!',
        'source1.txt': 'text1 \n //< mark1 \n m1 line1 \nm1 line2\n//> \ntext2',
        'source 1.txt': 'text1 \n //< mark1 \n m1 line1 \nm1 line2\n//> \ntext2',
        'source-empty-content-mark.txt': 'text1 \n //< mark1\n//> \ntext2 \n //< mark2 \n m1 line1 \nm1 line2\n//> ',
        'source-mark-without-name.txt': 'text1 \n //< mark1 \n m1 line1 \nm1 line2\n//> \ntext2 //< \n abc\n//<',
        'source-invalid-mark-name.txt': 'text1 \n //< mark1 \n m1 line1 \nm1 line2\n//> \ntext2 \n//< inv alid mark \n abc\n//<',
        'source-with-no-marks.txt': 'text1 \n \ntext2 ',
        'dir-for-insert': {
            'source-with-no-marks.txt': 'text1 \n \ntext2 ',
        },
    });
    mock_fs_1.default.file();
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
    test('valid existent mark name, empty mark content - inserts empty line', async () => {
        const p = (0, includo_1.createIncludoProcessor)(includo_1.DEFAULT_INCLUDO_OPTIONS);
        const res = await p('mark-valid-exists-empty-content.txt', output);
        expect(res.lineNumber).toEqual(4);
        expect(output.toString()).toEqual('Hello, \n\nWorld!\n');
    });
    test('empty mark name in source file - processes without error', async () => {
        const p = (0, includo_1.createIncludoProcessor)(includo_1.DEFAULT_INCLUDO_OPTIONS);
        const res = await p('mark-valid-exists-source-with-empty-mark-name.txt', output);
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
    test('invalid mark name (contains forbidden characters)', async () => {
        expect.assertions(4);
        const p = (0, includo_1.createIncludoProcessor)(includo_1.DEFAULT_INCLUDO_OPTIONS);
        try {
            await p('mark-valid-source-mark-invalid.txt', output);
        }
        catch (e) {
            expect(e.message).toContain('mark-valid-source-mark-invalid.txt:3'); //file&line info
            expect(e.message).toContain('@@ source-invalid-mark-name.txt mark1 '); //line
            expect(e.message).toContain('Invalid mark name'); //err
            expect(e.message).toContain('[inv alid mark]'); //err
        }
    });
    test('use mark from file that contains no marks', async () => {
        expect.assertions(3);
        const p = (0, includo_1.createIncludoProcessor)(includo_1.DEFAULT_INCLUDO_OPTIONS);
        try {
            await p('mark-valid-source-with-no-marks.txt', output);
        }
        catch (e) {
            expect(e.message).toContain('mark-valid-source-with-no-marks.txt:2'); //file&line info
            expect(e.message).toContain('@@ source-with-no-marks.txt mark1 '); //line
            expect(e.message).toContain('No marks found'); //err
        }
    });
    test('use mark from file that contains no marks. Custom BaseDir', async () => {
        expect.assertions(4);
        const p = (0, includo_1.createIncludoProcessor)({ baseDir: 'dir-for-insert' });
        try {
            await p('mark-valid-source-with-no-marks.txt', output);
        }
        catch (e) {
            expect(e.message).toContain('mark-valid-source-with-no-marks.txt:2'); //file&line info
            expect(e.message).toContain('@@ source-with-no-marks.txt mark1 '); //line
            expect(e.message).toContain('No marks found'); //err
            expect(e.message).toContain('dir-for-insert/source-with-no-marks.txt'); //contains basedir in file path
        }
    });
    test('invalid mark name in input file', async () => {
        expect.assertions(3);
        const p = (0, includo_1.createIncludoProcessor)(includo_1.DEFAULT_INCLUDO_OPTIONS);
        try {
            await p('mark-invalid.txt', output);
        }
        catch (e) {
            expect(e.message).toContain('mark-invalid.txt:3'); //file&line info
            expect(e.message).toContain('@@ source1.txt *invalidMark '); //line
            expect(e.message).toContain('Invalid mark name'); //err
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
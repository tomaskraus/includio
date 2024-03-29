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
const includio_1 = require("../../src/core/includio");
const mStream = __importStar(require("memory-streams"));
const line_transform_machines_1 = require("line-transform-machines");
// import * as fs from 'fs';
// let input: stream.Readable;
let output;
beforeEach(() => {
    (0, mock_fs_1.default)({
        'directive-valid-file-name.txt': 'Hello, \n@@ source1.txt \nWorld!\n',
        'directive-valid-file-name-indented.txt': 'Hello, \n   @@ source1.txt \nWorld!\n',
        // 'directive-valid-file-name-in-single-quotes.txt':
        //   "Hello, \n@@ 'someFile 2.txt' \nWorld!\n",
        'directive-valid-file-path.txt': 'Hello, \n@@ ./source1.txt \nWorld!\n',
        'directive-valid-file-name-in-double-quotes.txt': 'Hello, \n@@ "source 1.txt" \nWorld!\n',
        'directive-empty-file.txt': 'Hello, \n@@ ./source_empty.txt \nWorld!\n',
        'directive-invalid-file-name.txt': 'Hello, \n@@ ab*cd \nWorld!',
        'directive-nonexistent-file-name.txt': 'Hello, \n@@ nonexistentfile.txt \nWorld!',
        'unknown-cmd-name.txt': 'Hello, \n@@ source1.txt unknownCmd:  \nWorld!\n',
        'source1.txt': '-- text insert --\n-- text line2 --\n',
        'source 1.txt': '-- "text" insert --\n-- text line2 --\n',
        'source_empty.txt': '',
        'dir-for-insert': {
            'source1.txt': '-- dir text insert --\n-- dir text line2 --\n',
        },
    });
    mock_fs_1.default.file();
    // input = fs.createReadStream('my-file.txt');
    output = new mStream.WritableStream();
});
afterEach(() => {
    mock_fs_1.default.restore();
});
describe('normal ops', () => {
    test('input with valid file name directive', async () => {
        const p = (0, includio_1.createIncludioProcessor)(includio_1.DEFAULT_INCLUDIO_OPTIONS).lineMachine;
        const res = await p('directive-valid-file-name.txt', output);
        expect(res.lineNumber).toEqual(4);
        expect(output.toString()).toEqual('Hello, \n-- text insert --\n-- text line2 --\n\nWorld!\n');
    });
    test('input with valid file name directive, indented', async () => {
        const p = (0, includio_1.createIncludioProcessor)(includio_1.DEFAULT_INCLUDIO_OPTIONS).lineMachine;
        const res = await p('directive-valid-file-name-indented.txt', output);
        expect(res.lineNumber).toEqual(4);
        expect(output.toString()).toEqual('Hello, \n   -- text insert --\n   -- text line2 --\n   \nWorld!\n');
    });
    test('input with valid file name directive, using non-empty resourceDir', async () => {
        const p = (0, includio_1.createIncludioProcessor)({
            resourceDir: 'dir-for-insert',
        }).lineMachine;
        const res = await p('directive-valid-file-name.txt', output);
        expect(res.lineNumber).toEqual(4);
        expect(output.toString()).toEqual('Hello, \n-- dir text insert --\n-- dir text line2 --\n\nWorld!\n');
    });
    test('input with valid file name (in double-quotes) directive', async () => {
        const p = (0, includio_1.createIncludioProcessor)(includio_1.DEFAULT_INCLUDIO_OPTIONS).lineMachine;
        const res = await p('directive-valid-file-name-in-double-quotes.txt', output);
        expect(res.lineNumber).toEqual(4);
        expect(output.toString()).toEqual('Hello, \n-- "text" insert --\n-- text line2 --\n\nWorld!\n');
    });
    test('input with empty file with valid name directive adds empty line', async () => {
        const p = (0, includio_1.createIncludioProcessor)(includio_1.DEFAULT_INCLUDIO_OPTIONS).lineMachine;
        const res = await p('directive-empty-file.txt', output);
        expect(res.lineNumber).toEqual(4);
        expect(output.toString()).toEqual('Hello, \n\nWorld!\n');
    });
    test('input with valid file name (including a path) directive', async () => {
        const p = (0, includio_1.createIncludioProcessor)(includio_1.DEFAULT_INCLUDIO_OPTIONS).lineMachine;
        const res = await p('directive-valid-file-path.txt', output);
        expect(res.lineNumber).toEqual(4);
        expect(output.toString()).toEqual('Hello, \n-- text insert --\n-- text line2 --\n\nWorld!\n');
    });
});
describe('error handling', () => {
    test('Invalid file name for insertion (with invalid characters in file name)', async () => {
        expect.assertions(2);
        const p = (0, includio_1.createIncludioProcessor)(includio_1.DEFAULT_INCLUDIO_OPTIONS).lineMachine;
        try {
            await p('directive-invalid-file-name.txt', output);
        }
        catch (e) {
            expect(e).toBeInstanceOf(line_transform_machines_1.LineMachineError);
            expect(e.message).toContain('Invalid');
        }
    });
    test('Non-existent file for insertion', async () => {
        expect.assertions(2);
        const p = (0, includio_1.createIncludioProcessor)(includio_1.DEFAULT_INCLUDIO_OPTIONS).lineMachine;
        try {
            await p('directive-nonexistent-file-name.txt', output);
        }
        catch (e) {
            expect(e).toBeInstanceOf(line_transform_machines_1.LineMachineError);
            expect(e.message).toContain('ENOENT'); //err
        }
    });
    test('Non-existent file for insertion, in existent resourceDir', async () => {
        expect.assertions(2);
        const p = (0, includio_1.createIncludioProcessor)({
            resourceDir: 'dir-for-insert',
        }).lineMachine;
        try {
            await p('directive-nonexistent-file-name.txt', output);
        }
        catch (e) {
            expect(e).toBeInstanceOf(line_transform_machines_1.LineMachineError);
            expect(e.message).toContain('ENOENT'); //err
        }
    });
    test('Non-existent resourceDir', async () => {
        expect.assertions(2);
        const p = (0, includio_1.createIncludioProcessor)({ resourceDir: 'abc' }).lineMachine;
        try {
            await p('directive-valid-file-name.txt', output);
        }
        catch (e) {
            expect(e).toBeInstanceOf(line_transform_machines_1.LineMachineError);
            expect(e.message).toContain('ENOENT'); //err
        }
    });
});
//# sourceMappingURL=include_whole_file.test.js.map
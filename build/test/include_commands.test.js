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
        'first-cmd-view-more.txt': 'Hello, \n@@ source1.txt : part1 | first 4 \nWorld!\n',
        'first-cmd-view-less.txt': 'Hello, \n@@ source1.txt | first 3 \n our\n World!\n',
        'first-cmd-view-exact.txt': 'Hello, \n@@ source1.txt : part1 | first 2 \nWorld!\n',
        'first-cmd-no-args.txt': 'Hello, \n@@ source1.txt : part1 | first \nWorld!\n',
        'unknown-cmd.txt': 'Hello, \n@@ source1.txt | unkn \nWorld!\n',
        'invalid-cmd.txt': 'Hello, \n@@ source1.txt | in*valid 24 \nWorld!\n',
        'empty-pipe.txt': 'Hello, \n@@ source1.txt | \nWorld!\n',
        'empty-pipe-part.txt': 'Hello, \n@@ source1.txt : part1 |\nWorld!\n',
        'source1.txt': 'text1 \n //< part1 \n m1 line1 \nm1 line2\n//< \ntext2',
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
describe('command: first', () => {
    test('view more than provided', async () => {
        const p = (0, includo_1.createIncludoProcessor)(includo_1.DEFAULT_INCLUDO_OPTIONS);
        await p('first-cmd-view-more.txt', output);
        expect(output.toString()).toEqual('Hello, \n m1 line1 \nm1 line2\nWorld!\n');
    });
    test('view less than provided', async () => {
        const p = (0, includo_1.createIncludoProcessor)(includo_1.DEFAULT_INCLUDO_OPTIONS);
        await p('first-cmd-view-less.txt', output);
        expect(output.toString()).toEqual('Hello, \ntext1 \n //< part1 \n m1 line1 \n our\n World!\n');
    });
    test('view exactly the line count what provided', async () => {
        const p = (0, includo_1.createIncludoProcessor)(includo_1.DEFAULT_INCLUDO_OPTIONS);
        await p('first-cmd-view-exact.txt', output);
        expect(output.toString()).toEqual('Hello, \n m1 line1 \nm1 line2\nWorld!\n');
    });
    test('no args', async () => {
        expect.assertions(4);
        const p = (0, includo_1.createIncludoProcessor)(includo_1.DEFAULT_INCLUDO_OPTIONS);
        try {
            await p('first-cmd-no-args.txt', output);
        }
        catch (e) {
            expect(e.message).toContain('first-cmd-no-args.txt:2'); //file&line info
            expect(e.message).toContain('@@ source1.txt : part1 | first'); //line
            expect(e.message).toContain('no integer value found'); //err
            expect(e.message).toContain('first <maxLineCount: number>'); //err
        }
    });
});
describe('general error handling', () => {
    test('empty pipe', async () => {
        expect.assertions(3);
        const p = (0, includo_1.createIncludoProcessor)(includo_1.DEFAULT_INCLUDO_OPTIONS);
        try {
            await p('empty-pipe.txt', output);
        }
        catch (e) {
            expect(e.message).toContain('empty-pipe.txt:2'); //file&line info
            expect(e.message).toContain('@@ source1.txt | '); //line
            expect(e.message).toContain('Empty command in pipe'); //err
        }
    });
    test('invalid command name', async () => {
        expect.assertions(4);
        const p = (0, includo_1.createIncludoProcessor)(includo_1.DEFAULT_INCLUDO_OPTIONS);
        try {
            await p('invalid-cmd.txt', output);
        }
        catch (e) {
            expect(e.message).toContain('invalid-cmd.txt:2'); //file&line info
            expect(e.message).toContain('@@ source1.txt | in*valid 24'); //line
            expect(e.message).toContain('Invalid command name'); //err
            expect(e.message).toContain('[in*valid 24]'); //err
        }
    });
    test('unknown command', async () => {
        expect.assertions(4);
        const p = (0, includo_1.createIncludoProcessor)(includo_1.DEFAULT_INCLUDO_OPTIONS);
        try {
            await p('unknown-cmd.txt', output);
        }
        catch (e) {
            expect(e.message).toContain('unknown-cmd.txt:2'); //file&line info
            expect(e.message).toContain('@@ source1.txt | unkn'); //line
            expect(e.message).toContain('Unknown command'); //err
            expect(e.message).toContain('[unkn]'); //err
        }
    });
});
//# sourceMappingURL=include_commands.test.js.map
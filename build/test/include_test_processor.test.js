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
const includo_1 = require("../src/core/includo");
const mStream = __importStar(require("memory-streams"));
let output;
beforeEach(() => {
    (0, mock_fs_1.default)({
        'error-file.txt': 'Hello, \n@@ nonexistent.txt \nWorld!\n@@ source1.txt : p1',
        'source1.txt': 'text1 \n //< part1 \n m1 line1 \nm1 line2\n//< \ntext',
    });
    mock_fs_1.default.file();
    output = new mStream.WritableStream();
});
afterEach(() => {
    mock_fs_1.default.restore();
});
describe('normal ops', () => {
    test('test input that contains errors', async () => {
        const t = (0, includo_1.createTestIncludoProcessor)(includo_1.DEFAULT_INCLUDO_OPTIONS);
        await t('error-file.txt', output);
        const result = output.toString();
        expect(result).toContain('error-file.txt:2');
        expect(result).toContain('error-file.txt:4');
    });
});
//# sourceMappingURL=include_test_processor.test.js.map
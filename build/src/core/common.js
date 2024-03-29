"use strict";
/**
 * shared functions & types for the Includio app
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIndentStr = exports.getFileLineInfoStr = exports.parseFileName = exports.createFileNameResolver = exports.mergeIncludioOptions = exports.DEFAULT_INCLUDIO_OPTIONS = exports.COMMAND_NAME_REGEXP = exports.PART_NAME_REGEXP = exports.VAR_NAME_REGEXP = exports.appLog = void 0;
const debug_1 = __importDefault(require("debug"));
const node_path_1 = require("node:path");
exports.appLog = (0, debug_1.default)('includio');
exports.VAR_NAME_REGEXP = /[a-zA-z]+[\w\d]*/;
exports.PART_NAME_REGEXP = /[_a-zA-z]+[-\w\d]*/;
exports.COMMAND_NAME_REGEXP = exports.VAR_NAME_REGEXP;
exports.DEFAULT_INCLUDIO_OPTIONS = {
    directiveMark: '@@',
    resourceDir: '.',
    markPairMap: [
        ['js', '//<', ''],
        ['ts', '//<', ''],
        ['jsx', '//<', ''],
        ['tsx', '//<', ''],
        ['php', '//<', ''],
        ['java', '//<', ''],
        ['c', '//<', ''],
        ['cpp', '//<', ''],
        ['h', '//<', ''],
        ['ino', '//<', ''],
        ['cs', '//<', ''],
        ['kf', '//<', ''],
        ['swift', '//<', ''],
        ['go', '//<', ''],
        ['html', '<!--<', '-->'],
        ['md', '<!--<', '-->'],
        ['css', '/*<', '*/'],
        ['py', '#<', ''],
        ['sh', '#<', ''],
        ['sql', '--<', ''],
        ['ini', ';<', ''],
        ['bat', 'REM<', ''],
        ['vb', "'<", ''],
    ],
    defaultMarkPair: ['//<', ''],
};
const mergeIncludioOptions = (opts) => ({ ...exports.DEFAULT_INCLUDIO_OPTIONS, ...opts });
exports.mergeIncludioOptions = mergeIncludioOptions;
const createFileNameResolver = (resourceDir) => (fileName) => (0, node_path_1.normalize)((0, node_path_1.join)(resourceDir, fileName));
exports.createFileNameResolver = createFileNameResolver;
const createParseFileName = () => {
    // https://stackoverflow.com/questions/6768779/test-filename-with-regular-expression
    const FILEPATH_REGEXP = /^[^<>;,?"*| ]+$/;
    const FILEPATH_QUOTED_REGEXP = /^"[^<>;,?"*|]+"$/;
    return (line) => {
        const sanitizedLine = line.trim();
        if (FILEPATH_REGEXP.test(sanitizedLine)) {
            return sanitizedLine;
        }
        if (FILEPATH_QUOTED_REGEXP.test(sanitizedLine)) {
            //remove quotes
            return sanitizedLine.slice(1, -1);
        }
        throw new Error(`Invalid file name format: (${line})`);
    };
};
exports.parseFileName = createParseFileName();
const getFileLineInfoStr = (fileName, lineNumber) => `${fileName}:${lineNumber}`;
exports.getFileLineInfoStr = getFileLineInfoStr;
const createGetIndentStr = () => {
    const indentRegexp = /^(\s+).*$/;
    return (s) => {
        const res = s.match(indentRegexp) || ['', ''];
        return res[1];
    };
};
exports.getIndentStr = createGetIndentStr();
//# sourceMappingURL=common.js.map
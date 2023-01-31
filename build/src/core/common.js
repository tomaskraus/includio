"use strict";
/**
 * shared functions & types for the Includo app
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFileName = exports.createFileNameResolver = exports.DEFAULT_INCLUDO_OPTIONS = exports.COMMAND_NAME_REGEXP = exports.PART_NAME_REGEXP = exports.VAR_NAME_REGEXP = exports.appLog = void 0;
const debug_1 = __importDefault(require("debug"));
const node_path_1 = require("node:path");
exports.appLog = (0, debug_1.default)('includo');
exports.VAR_NAME_REGEXP = /^[a-zA-z]+[\w\d]*$/;
exports.PART_NAME_REGEXP = exports.VAR_NAME_REGEXP;
exports.COMMAND_NAME_REGEXP = exports.VAR_NAME_REGEXP;
exports.DEFAULT_INCLUDO_OPTIONS = {
    tagInsert: '@@',
    resourceDir: '',
};
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
        throw new Error(`Invalid file name format: [${line}]
        File name contains spaces. Enclose such a file name in quotes.`);
    };
};
exports.parseFileName = createParseFileName();
//# sourceMappingURL=common.js.map
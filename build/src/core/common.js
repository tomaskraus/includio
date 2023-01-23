"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFileNameResolver = exports.DEFAULT_INCLUDO_OPTIONS = exports.MARK_NAME_REGEXP = exports.appLog = void 0;
const debug_1 = __importDefault(require("debug"));
const node_path_1 = require("node:path");
exports.appLog = (0, debug_1.default)('includo');
exports.MARK_NAME_REGEXP = /^[a-zA-z]+[\w\d-]*$/;
exports.DEFAULT_INCLUDO_OPTIONS = {
    tagInsert: '@@',
    baseDir: '',
};
const createFileNameResolver = (baseDir) => (fileName) => (0, node_path_1.normalize)((0, node_path_1.join)(baseDir, fileName));
exports.createFileNameResolver = createFileNameResolver;
//# sourceMappingURL=common.js.map
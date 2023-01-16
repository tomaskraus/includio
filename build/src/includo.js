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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIncludoProcessor = exports.DEFAULT_INCLUDO_OPTIONS = void 0;
const crb = __importStar(require("@krausoft/comment-regexp-builder"));
const line_transform_machines_1 = require("line-transform-machines");
exports.DEFAULT_INCLUDO_OPTIONS = {
    tag_insert: '@@',
};
const includerCB = (options) => {
    const tagForInsert = crb.createStartTag(options.tag_insert);
    return (line) => {
        if (tagForInsert.test(line)) {
            throw new Error('EEE!');
            //return '---insert!----\n---code!------\n';
        }
        return `*-* ${line}\n`;
    };
};
const createIncludoProcessor = (options) => {
    const opts = { ...exports.DEFAULT_INCLUDO_OPTIONS, options };
    return (0, line_transform_machines_1.createLineMachine)(includerCB(opts));
};
exports.createIncludoProcessor = createIncludoProcessor;
//# sourceMappingURL=includo.js.map
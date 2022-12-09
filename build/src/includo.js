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
exports.processRead2 = exports.processRead = exports.DEFAULT_INCLUDO_OPTIONS = void 0;
const stream_1 = __importDefault(require("stream"));
const readline = __importStar(require("node:readline"));
exports.DEFAULT_INCLUDO_OPTIONS = {
    encoding: 'utf8',
};
const writerCallback = (err) => {
    if (err) {
        console.error(err);
    }
};
const processRead = (input, output, options) => {
    // if (!options) {
    //   DEFAULT_INCLUDO_OPTIONS
    // }
    // from: https://nodejs.org/api/stream.html#class-streamwritable
    function safeWrite(data, callback) {
        if (!output.write(data)) {
            output.once('drain', callback);
        }
        else {
            process.nextTick(callback);
        }
    }
    return new Promise((resolve, reject) => {
        try {
            const rl = readline.createInterface({ input });
            rl.on('line', (s) => safeWrite(`- ${s}\n`, writerCallback));
            rl.on('close', () => resolve('read ok'));
        }
        catch (e) {
            reject(e);
        }
    });
};
exports.processRead = processRead;
const processRead2 = (input, output, options) => {
    const trs = new stream_1.default.Transform({
        transform(chunk, encoding, callback) {
            callback(null, `* ${chunk}\n`);
        },
    });
    return new Promise((resolve, reject) => {
        input
            .pipe(trs)
            .pipe(output)
            .on('error', err => reject(err))
            .on('end', () => {
            output.end();
            resolve('ok2');
        });
    });
};
exports.processRead2 = processRead2;
//# sourceMappingURL=includo.js.map
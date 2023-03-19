"use strict";
/**
 * IncludioProcessor
 *
 * Reads input (from file/stream) line by line and replaces tagged lines with some content.
 *   Source of that content and further instructions are written on that tagged line.
 * Writes the result to the output (file/stream).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestIncludioProcessor = exports.createIncludioProcessor = exports.DEFAULT_INCLUDIO_OPTIONS = void 0;
const line_transform_machines_1 = require("line-transform-machines");
const insertion_dispatcher_1 = require("./insertion_dispatcher");
const common_1 = require("./common");
Object.defineProperty(exports, "DEFAULT_INCLUDIO_OPTIONS", { enumerable: true, get: function () { return common_1.DEFAULT_INCLUDIO_OPTIONS; } });
const first_matcher_1 = require("../utils/first_matcher");
const log = common_1.appLog.extend('processor');
const createDefaultDirectiveLineCB = (options) => {
    const insertionDispatcher = (0, insertion_dispatcher_1.createInsertionDispatcher)(options);
    return async (line) => {
        return insertionDispatcher(line);
    };
};
// const DEFAULT_INCLUDIO_CALLBACKS: TIncludioCallbacks = {
//   directiveLine:
// };
const createIncludioProcessor = (options, callbacks) => {
    log('CREATE includio processor');
    const opts = { ...common_1.DEFAULT_INCLUDIO_OPTIONS, ...options };
    const cbks = {
        directiveLine: createDefaultDirectiveLineCB(opts),
    };
    const insertionTagMatcher = (0, first_matcher_1.createFirstMatcher)(opts.tagInsert);
    const cb = async (line) => {
        if (insertionTagMatcher.test(line)) {
            return cbks.directiveLine(insertionTagMatcher.tail(line));
        }
        return line;
    };
    return (0, line_transform_machines_1.createAsyncLineMachine)(cb);
};
exports.createIncludioProcessor = createIncludioProcessor;
// export const createIncludioProcessor = (
//   options?: Partial<TIncludioOptions>
// ): TFileProcessor<TFileLineContext> => {
//   return createAsyncLineMachine(createIncludioLineCallback1(opts));
// };
//--------------------------------------------------------
// const createIncludioLineCallback1 = (
//   options: TIncludioOptions
// ): TAsyncLineCallback => {
//   const insertionTagMatcher = createFirstMatcher(options.tagInsert);
//   const insertionDispatcher = createInsertionDispatcher(options);
//   log(`CREATE includioCallback for tag [${options.tagInsert}] `);
//   return async (line: string): Promise<string> => {
//     if (insertionTagMatcher.test(line)) {
//       return insertionDispatcher(insertionTagMatcher.tail(line));
//     }
//     return Promise.resolve(line);
//   };
// };
// export const createIncludioProcessor1 = (
//   options?: Partial<TIncludioOptions>
// ): TFileProcessor<TFileLineContext> => {
//   const opts = {...DEFAULT_INCLUDIO_OPTIONS, ...options};
//   log('CREATE includio processor');
//   return createAsyncLineMachine(createIncludioLineCallback1(opts));
// };
const createTestIncludioLineCallback = (options) => {
    const insertionTagMatcher = (0, first_matcher_1.createFirstMatcher)(options.tagInsert);
    const insertionDispatcher = (0, insertion_dispatcher_1.createInsertionDispatcher)(options);
    log(`CREATE testIncludioCallback for tag [${options.tagInsert}] `);
    return async (line, lineNumber, fileLineInfo) => {
        if (insertionTagMatcher.test(line)) {
            try {
                await insertionDispatcher(insertionTagMatcher.tail(line));
            }
            catch (e) {
                const flinfoStr = fileLineInfo || '';
                return `"${flinfoStr}" ; ${e.message}`;
            }
        }
        return null;
    };
};
const createTestIncludioProcessor = (options) => {
    const opts = { ...common_1.DEFAULT_INCLUDIO_OPTIONS, ...options };
    log('CREATE testIncludio processor');
    return (0, line_transform_machines_1.createAsyncLineMachine)(createTestIncludioLineCallback(opts));
};
exports.createTestIncludioProcessor = createTestIncludioProcessor;
//# sourceMappingURL=includio.js.map
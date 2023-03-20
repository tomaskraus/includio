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
const makeIncludioProcessor = (includioCallbacks, options) => {
    const insertionTagMatcher = (0, first_matcher_1.createFirstMatcher)(options.tagInsert);
    const callback = async (line, lineNumber, fileLineInfo) => {
        if (insertionTagMatcher.test(line)) {
            try {
                return await includioCallbacks.directiveLine(insertionTagMatcher.tail(line), fileLineInfo);
            }
            catch (e) {
                return includioCallbacks.errorHandler(e, fileLineInfo);
            }
        }
        return includioCallbacks.normalLine(line, fileLineInfo);
    };
    log('make Includio processor');
    return (0, line_transform_machines_1.createAsyncLineMachine)(callback);
};
const createDispatchDirectiveLineCB = (options) => {
    const insertionDispatcher = (0, insertion_dispatcher_1.createInsertionDispatcher)(options);
    return async (line) => {
        return await insertionDispatcher(line);
    };
};
const identityLineCB = async (line) => line;
const raiseErrorHandlerCB = (err) => {
    throw err;
};
const createIncludioProcessor = (options) => {
    const opts = { ...common_1.DEFAULT_INCLUDIO_OPTIONS, ...options };
    log('CREATE Includio processor');
    return makeIncludioProcessor({
        directiveLine: createDispatchDirectiveLineCB(opts),
        normalLine: identityLineCB,
        errorHandler: raiseErrorHandlerCB,
    }, opts);
};
exports.createIncludioProcessor = createIncludioProcessor;
// ----------------
const nullLineCB = async () => null;
const printErrorHandlerCB = (err, fileLineInfo) => {
    const flinfoStr = fileLineInfo || '';
    return `"${flinfoStr}" ; ${err.message}`;
};
const createSilentDispatchDirectiveLineCB = (options) => {
    const insertionDispatcher = (0, insertion_dispatcher_1.createInsertionDispatcher)(options);
    return async (line) => {
        await insertionDispatcher(line);
        return null;
    };
};
const createTestIncludioProcessor = (options) => {
    const opts = { ...common_1.DEFAULT_INCLUDIO_OPTIONS, ...options };
    log('CREATE testIncludio processor');
    return makeIncludioProcessor({
        directiveLine: createSilentDispatchDirectiveLineCB(opts),
        normalLine: nullLineCB,
        errorHandler: printErrorHandlerCB,
    }, opts);
};
exports.createTestIncludioProcessor = createTestIncludioProcessor;
//# sourceMappingURL=includio.js.map
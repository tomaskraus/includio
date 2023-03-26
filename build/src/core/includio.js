"use strict";
/**
 * IncludioProcessor
 *
 * Reads input (from file/stream) line by line and replaces tagged lines with some content.
 *   Source of that content and further instructions are written on that tagged line.
 * Writes the result to the output (file/stream).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createListIncludioProcessor = exports.createTestIncludioProcessor = exports.createIncludioProcessor = exports.DEFAULT_INCLUDIO_OPTIONS = void 0;
const line_transform_machines_1 = require("line-transform-machines");
const insertion_dispatcher_1 = require("./insertion_dispatcher");
const common_1 = require("./common");
Object.defineProperty(exports, "DEFAULT_INCLUDIO_OPTIONS", { enumerable: true, get: function () { return common_1.DEFAULT_INCLUDIO_OPTIONS; } });
const first_matcher_1 = require("../utils/first_matcher");
const log = common_1.appLog.extend('processor');
const makeIncludioProcessor = (includioCallbacks, options) => {
    const directiveMatcher = (0, first_matcher_1.createFirstMatcher)(options.directiveTag);
    const callback = async (line, lineNumber, fileLineInfo) => {
        if (directiveMatcher.test(line)) {
            try {
                return await includioCallbacks.directiveLine(line, fileLineInfo);
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
// =====================
const createSilentDispatchDirectiveLineCB = (options) => {
    const insertionDispatcher = (0, insertion_dispatcher_1.createInsertionDispatcher)(options);
    return async (line) => {
        await insertionDispatcher(line);
        return null;
    };
};
const printDirectiveLineCB = async (line, fileLineInfo) => {
    const flinfoStr = fileLineInfo || '';
    return `"${flinfoStr}" ; ${line}`;
};
const identityLineCB = async (line) => line;
const nullLineCB = async () => null;
const printErrorHandlerCB = (err, fileLineInfo) => {
    const flinfoStr = fileLineInfo || '';
    return `"${flinfoStr}" ; ${err.message}`;
};
const raiseErrorHandlerCB = (err) => {
    throw err;
};
// --------------
const createIncludioProcessor = (options) => {
    const opts = (0, common_1.mergeIncludioOptions)(options);
    log('CREATE Includio processor');
    return makeIncludioProcessor({
        directiveLine: (0, insertion_dispatcher_1.createInsertionDispatcher)(opts),
        normalLine: identityLineCB,
        errorHandler: raiseErrorHandlerCB,
    }, opts);
};
exports.createIncludioProcessor = createIncludioProcessor;
// ----------------
const createTestIncludioProcessor = (options) => {
    const opts = (0, common_1.mergeIncludioOptions)(options);
    log('CREATE testIncludio processor');
    return makeIncludioProcessor({
        directiveLine: createSilentDispatchDirectiveLineCB(opts),
        normalLine: nullLineCB,
        errorHandler: printErrorHandlerCB,
    }, opts);
};
exports.createTestIncludioProcessor = createTestIncludioProcessor;
// ------------------
const createListIncludioProcessor = (options) => {
    const opts = (0, common_1.mergeIncludioOptions)(options);
    log('CREATE linkIncludio processor');
    return makeIncludioProcessor({
        directiveLine: printDirectiveLineCB,
        normalLine: nullLineCB,
        errorHandler: printErrorHandlerCB,
    }, opts);
};
exports.createListIncludioProcessor = createListIncludioProcessor;
//# sourceMappingURL=includio.js.map
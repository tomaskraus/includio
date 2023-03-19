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
const createIncludioLineCallback = (options) => {
    const insertionTagMatcher = (0, first_matcher_1.createFirstMatcher)(options.tagInsert);
    const insertionDispatcher = (0, insertion_dispatcher_1.createInsertionDispatcher)(options);
    log(`CREATE includioCallback for tag [${options.tagInsert}] `);
    return async (line) => {
        if (insertionTagMatcher.test(line)) {
            return insertionDispatcher(insertionTagMatcher.tail(line));
        }
        return Promise.resolve(line);
    };
};
const createIncludioProcessor = (options) => {
    const opts = { ...common_1.DEFAULT_INCLUDIO_OPTIONS, ...options };
    log('CREATE includio processor');
    return (0, line_transform_machines_1.createAsyncLineMachine)(createIncludioLineCallback(opts));
};
exports.createIncludioProcessor = createIncludioProcessor;
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
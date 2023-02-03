"use strict";
/**
 * IncludoProcessor
 *
 * Reads input (from file/stream) line by line and replaces tagged lines with some content.
 *   Source of that content and further instructions are written on that tagged line.
 * Writes the result to the output (file/stream).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestIncludoProcessor = exports.createIncludoProcessor = exports.DEFAULT_INCLUDO_OPTIONS = void 0;
const line_transform_machines_1 = require("line-transform-machines");
const insertion_dispatcher_1 = require("./insertion_dispatcher");
const common_1 = require("./common");
Object.defineProperty(exports, "DEFAULT_INCLUDO_OPTIONS", { enumerable: true, get: function () { return common_1.DEFAULT_INCLUDO_OPTIONS; } });
const head_tail_matcher_1 = require("../utils/head_tail_matcher");
const log = common_1.appLog.extend('processor');
const createIncludoLineCallback = (options) => {
    const insertionTagMatcher = (0, head_tail_matcher_1.createHeadTailMatcher)(options.tagInsert);
    const insertionDispatcher = (0, insertion_dispatcher_1.createInsertionDispatcher)(options);
    log(`CREATE includoCallback for tag [${options.tagInsert}] `);
    return (line) => {
        if (insertionTagMatcher.test(line)) {
            return insertionDispatcher(insertionTagMatcher.tail(line));
        }
        return Promise.resolve(line);
    };
};
const createIncludoProcessor = (options) => {
    const opts = { ...common_1.DEFAULT_INCLUDO_OPTIONS, ...options };
    log('CREATE includo processor');
    return (0, line_transform_machines_1.createAsyncLineMachine)(createIncludoLineCallback(opts));
};
exports.createIncludoProcessor = createIncludoProcessor;
const createTestIncludoLineCallback = (options) => {
    const insertionTagMatcher = (0, head_tail_matcher_1.createHeadTailMatcher)(options.tagInsert);
    const insertionDispatcher = (0, insertion_dispatcher_1.createInsertionDispatcher)(options);
    log(`CREATE testIncludoCallback for tag [${options.tagInsert}] `);
    return async (line, lineNumber, fileLineInfo) => {
        if (insertionTagMatcher.test(line)) {
            try {
                await insertionDispatcher(insertionTagMatcher.tail(line));
                return null;
            }
            catch (e) {
                return `"${fileLineInfo}" ; ${e.message}`;
            }
        }
        return null;
    };
};
const createTestIncludoProcessor = (options) => {
    const opts = { ...common_1.DEFAULT_INCLUDO_OPTIONS, ...options };
    log('CREATE testIncludo processor');
    return (0, line_transform_machines_1.createAsyncLineMachine)(createTestIncludoLineCallback(opts));
};
exports.createTestIncludoProcessor = createTestIncludoProcessor;
//# sourceMappingURL=includo.js.map
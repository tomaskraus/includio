"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIncludoProcessor = exports.DEFAULT_INCLUDO_OPTIONS = void 0;
const line_transform_machines_1 = require("line-transform-machines");
const insertion_dispatcher_1 = require("./core/insertion_dispatcher");
const common_1 = require("./core/common");
Object.defineProperty(exports, "DEFAULT_INCLUDO_OPTIONS", { enumerable: true, get: function () { return common_1.DEFAULT_INCLUDO_OPTIONS; } });
const first_and_rest_matcher_1 = require("./utils/first_and_rest_matcher");
const log = (0, common_1.logger)('includo:includo');
const createIncludoLineCallback = (options) => {
    const insertionTagMatcher = (0, first_and_rest_matcher_1.createFirstAndRestMatcher)(options.tagInsert);
    const insertionDispatcher = (0, insertion_dispatcher_1.createInsertionDispatcher)(options);
    log(`CREATE includoCallback for tag [${options.tagInsert}] `);
    return (line) => {
        if (insertionTagMatcher.test(line)) {
            return insertionDispatcher(insertionTagMatcher.rest(line));
        }
        return Promise.resolve(line);
    };
};
const createIncludoProcessor = (options) => {
    const opts = { ...common_1.DEFAULT_INCLUDO_OPTIONS, ...options };
    log('CREATE includo engine');
    return (0, line_transform_machines_1.createAsyncLineMachine)(createIncludoLineCallback(opts));
};
exports.createIncludoProcessor = createIncludoProcessor;
//# sourceMappingURL=includo.js.map
"use strict";
/**
 * partTagProvider
 *
 * for a file name, returns a part tag string fot that file type.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPartTagProvider = void 0;
const common_1 = require("./common");
const log = common_1.appLog.extend('partTagProvider');
const createPartTagProvider = (options) => {
    log('CREATE partTagProvider');
    return (fileName) => {
        const tag = '//';
        log(`part tag for [${fileName}]: [${tag}]`);
        return tag;
    };
};
exports.createPartTagProvider = createPartTagProvider;
//# sourceMappingURL=part_tag_provider.js.map
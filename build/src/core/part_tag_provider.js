"use strict";
/**
 * partTagProvider
 *
 * for a file name, returns a pair [opening, closing] parts fot that file type.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPartTagProvider = void 0;
const common_1 = require("./common");
const log = common_1.appLog.extend('partTagProvider');
const createPartTagProvider = (options) => {
    log('CREATE partTagProvider');
    return (fileName) => {
        const tags = ['//<', '//>'];
        log(`part tags for [${fileName}]: [${tags[0]}],[${tags[1]}]`);
        return tags;
    };
};
exports.createPartTagProvider = createPartTagProvider;
//# sourceMappingURL=part_tag_provider.js.map
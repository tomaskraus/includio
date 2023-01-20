"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMarkTagProvider = void 0;
const common_1 = require("./common");
const log = (0, common_1.logger)('includo:markTagProvider');
const createMarkTagProvider = (options) => {
    log('CREATE markTagProvider');
    return (markFileName) => {
        const tags = ['//<', '//>'];
        log(`mark tags for [${markFileName}]: [${tags[0]}],[${tags[1]}]`);
        return tags;
    };
};
exports.createMarkTagProvider = createMarkTagProvider;
//# sourceMappingURL=mark_tag_provider.js.map
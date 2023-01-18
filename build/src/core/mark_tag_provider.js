"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMarkTagProvider = void 0;
const common_1 = require("./common");
const log = (0, common_1.logger)('includo:markTagProvider');
const createMarkTagProvider = (options) => {
    log('CREATE markTagProvider');
    return (fileName) => {
        return ['//<', '//>'];
    };
};
exports.createMarkTagProvider = createMarkTagProvider;
//# sourceMappingURL=mark_tag_provider.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMarkMapProvider = void 0;
const common_1 = require("./common");
const log = (0, common_1.logger)('includo:markMapProvider');
const createMarkMapProvider = (fileContentProvider, markTagProvider) => {
    log('CREATE markMapProvider');
    return async (fileName) => {
        log(`creating mark map from [${fileName}]`);
        const fileContent = await fileContentProvider(fileName);
        const [beginMarkTag, endMarkTag] = markTagProvider(fileName);
        return Promise.resolve(new Map().set('mark1', ' m1 line1 \nm1 line2'));
    };
};
exports.createMarkMapProvider = createMarkMapProvider;
//# sourceMappingURL=mark_map_provider.js.map
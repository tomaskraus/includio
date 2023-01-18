"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMarkContentProvider = void 0;
const common_1 = require("./common");
const mark_map_provider_1 = require("./mark_map_provider");
const log = (0, common_1.logger)('includo:markContentProvider');
const createMarkContentProvider = (fileContentProvider, markTagProvider) => {
    log('CREATE markContentProvider');
    const markMapProvider = (0, mark_map_provider_1.createMarkMapProvider)(fileContentProvider, markTagProvider);
    return async (fileName, markName) => {
        log(`getting marks map for file [${fileName}]`);
        const marksMap = await markMapProvider(fileName);
        log(`looking for mark [${markName}]`);
        const resultStr = marksMap.get(markName);
        if (typeof resultStr === 'undefined') {
            return Promise.reject(new Error(`mark [${markName}] not found in [${fileName}]`));
        }
        return Promise.resolve(resultStr);
    };
};
exports.createMarkContentProvider = createMarkContentProvider;
//# sourceMappingURL=mark_content_provider.js.map
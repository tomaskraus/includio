"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPartContentProvider = void 0;
/**
 * partContentProvider
 *
 * for a fileName and partName, returns content of a partName key for that file
 */
const common_1 = require("./common");
const log = common_1.appLog.extend('partContentProvider');
const createPartContentProvider = (partMapProvider, partNameRegexp) => {
    log('CREATE partContentProvider');
    return async (fileName, partName) => {
        if (partNameRegexp.test(partName) === false) {
            return Promise.reject(new Error(`Invalid part name: [${partName}]`));
        }
        log(`getting part map for file [${fileName}]`);
        const partsMap = await partMapProvider(fileName);
        log(`looking for part [${partName}]`);
        const resultStr = partsMap.get(partName);
        if (typeof resultStr === 'undefined') {
            return Promise.reject(new Error(`part [${partName}] not found in [${fileName}]`));
        }
        return Promise.resolve(resultStr);
    };
};
exports.createPartContentProvider = createPartContentProvider;
//# sourceMappingURL=part_content_provider.js.map
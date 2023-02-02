"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPartContentProvider = void 0;
/**
 * partContentProvider
 *
 * for a fileName and partName, returns content of a partName key for that file
 */
const word_matcher_1 = require("../utils/word_matcher");
const common_1 = require("./common");
const log = common_1.appLog.extend('partContentProvider');
const createPartContentProvider = (partMapProvider, partNameRegexp) => {
    log('CREATE partContentProvider');
    const partNameMatcher = (0, word_matcher_1.createWordMatcher)(partNameRegexp);
    return async (fileName, partNameStr) => {
        if (partNameMatcher.test(partNameStr) === false) {
            return Promise.reject(new Error(`Invalid part name: (${partNameStr})`));
        }
        const parsedPartName = partNameMatcher.value(partNameStr);
        log(`getting part map for file [${fileName}]`);
        const partsMap = await partMapProvider(fileName);
        log(`looking for part [${parsedPartName}]`);
        const resultStr = partsMap.get(parsedPartName);
        if (typeof resultStr === 'undefined') {
            return Promise.reject(new Error(`part (${parsedPartName}) not found in (${fileName})`));
        }
        return Promise.resolve(resultStr);
    };
};
exports.createPartContentProvider = createPartContentProvider;
//# sourceMappingURL=part_content_provider.js.map
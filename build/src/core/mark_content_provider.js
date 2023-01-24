"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMarkContentProvider = void 0;
/**
 * MarkContentProvider
 *
 * for a fileName and markName, returns content of a markName key for that file
 */
const common_1 = require("./common");
const log = common_1.appLog.extend('markContentProvider');
const createMarkContentProvider = (markMapProvider, markNameRegexp) => {
    log('CREATE markContentProvider');
    return async (fileName, markName) => {
        if (markNameRegexp.test(markName) === false) {
            return Promise.reject(new Error(`Invalid mark name: [${markName}]`));
        }
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
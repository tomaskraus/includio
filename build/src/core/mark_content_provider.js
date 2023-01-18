"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMarkContentProvider = void 0;
const common_1 = require("./common");
const log = (0, common_1.logger)('includo:markContentProvider');
const createMarkContentProvider = (fileContentProvider) => {
    //   const startMarkStr = '//<';
    //   const endMarkStr = '//>';
    log('CREATE markContentProvider for fileContentProvider');
    return async (fileName, markName) => {
        log(`creating marks for [${fileName}]`);
        const fileContent = await fileContentProvider(fileName);
        log(`looking for mark [${markName}]`);
        if (markName === 'mark1') {
            return Promise.resolve(' m1 line1 \nm1 line2');
        }
        return Promise.reject(new Error(`mark [${markName}] not found in [${fileName}]`));
    };
};
exports.createMarkContentProvider = createMarkContentProvider;
//# sourceMappingURL=mark_content_provider.js.map
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
        return Promise.resolve(new Map()
            .set('mark1', ' m1 line1 \nm1 line2')
            .set('txt', 'HUHUHU!')
            .set('import', 'HU!')
            .set('code', "import {logger} from './common';" +
            '\n' +
            "\nconst log = logger('includo:markMapProvider');" +
            '\n' +
            '\nexport const createMarkMapProvider = (' +
            '\n  fileContentProvider: (filename: string) => Promise<string>,' +
            '\n  markTagProvider: (filename: string) => [string, string]' +
            '\n) => {' +
            "\n  log('CREATE markMapProvider');" +
            '\n' +
            '\n  return async (fileName: string): Promise<Map<string, string>> => {' +
            '\n    log(`creating mark map from [${fileName}]`);' +
            '\n    const fileContent = await fileContentProvider(fileName);' +
            '\n    const [beginMarkTag, endMarkTag] = markTagProvider(fileName);' +
            '\n    return Promise.resolve(' +
            '\n      new Map<string, string>()' +
            "\n        .set('mark1', ' m1 line1 \\nm1 line2')" +
            "\n        .set('txt', 'HUHUHU!')" +
            "\n        .set('import', 'HU!')" +
            "\n        .set('code', '')" +
            '\n    );' +
            '\n  };' +
            '\n};' +
            '\n'));
    };
};
exports.createMarkMapProvider = createMarkMapProvider;
//# sourceMappingURL=mark_map_provider.js.map
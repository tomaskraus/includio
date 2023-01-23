"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMarkMapProvider = void 0;
const common_1 = require("./common");
const rxjs_1 = require("rxjs");
const stateful_predicates_1 = require("stateful-predicates");
const split_if_1 = require("split-if");
const cache_fn_1 = require("../utils/cache_fn");
const first_and_rest_matcher_1 = require("../utils/first_and_rest_matcher");
const log = common_1.appLog.extend('markMapProvider');
const createMarkMapProvider = (fileContentProvider, markTagProvider) => {
    log('CREATE markMapProvider');
    const _getMapFromFile = async (marksFileName) => {
        log(`creating mark map from [${marksFileName}]`);
        const [beginMarkStr, endMarkStr] = markTagProvider(marksFileName);
        const beginMarkMatcher = (0, first_and_rest_matcher_1.createFirstAndRestMatcher)(beginMarkStr);
        const endMarkMatcher = (0, first_and_rest_matcher_1.createFirstAndRestMatcher)(endMarkStr);
        const fileContent = await fileContentProvider(marksFileName);
        const marks = new Map();
        return new Promise((resolve, reject) => {
            (0, rxjs_1.from)(fileContent.split('\n'))
                .pipe((0, rxjs_1.filter)(
            // select only lines enclosed by beginMarkTag and endMarkTag. Include line with beginMarkTag
            (0, stateful_predicates_1.switchTrueFalse)(s => beginMarkMatcher.test(s), s => endMarkMatcher.test(s))), 
            // group the lines by their tags
            (0, split_if_1.splitIf)(s => beginMarkMatcher.test(s)), 
            //create a mark record
            (0, rxjs_1.map)(lines => {
                const name = beginMarkMatcher.rest(lines[0]);
                if (name.length > 0 && !common_1.MARK_NAME_REGEXP.test(name)) {
                    throw new Error(`Invalid mark name [${name}]`);
                }
                return {
                    name,
                    value: lines.slice(1).join('\n'),
                };
            }), 
            //do not allow mark record with an empty name
            (0, rxjs_1.filter)(markRecord => markRecord.name.length > 0), 
            //add mark record to a map
            (0, rxjs_1.scan)((acc, markRecord) => {
                log(`CREATE mark [${marksFileName}][${markRecord.name}]`);
                return acc.set(markRecord.name, markRecord.value);
            }, marks))
                .subscribe({
                error: err => {
                    reject(err);
                },
                complete: () => {
                    if (marks.size === 0) {
                        reject(new Error(`No marks found in [${marksFileName}]`));
                    }
                    resolve(marks);
                },
            });
        });
    };
    return (0, cache_fn_1.cacheOneArgFnAsync)(_getMapFromFile);
};
exports.createMarkMapProvider = createMarkMapProvider;
//# sourceMappingURL=mark_map_provider.js.map
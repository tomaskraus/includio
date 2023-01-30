"use strict";
/**
 * partMapProvider
 *
 * for a file, extract its parts contents to a map
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPartMapProvider = void 0;
const common_1 = require("./common");
const rxjs_1 = require("rxjs");
const split_if_1 = require("split-if");
const cache_fn_1 = require("../utils/cache_fn");
const head_tail_matcher_1 = require("../utils/head_tail_matcher");
const log = common_1.appLog.extend('partMapProvider');
const createPartMapProvider = (fileContentProvider, partTagProvider, partNameRegexp) => {
    log('CREATE partMapProvider');
    const _getMapFromFile = async (partsFileName) => {
        log(`creating part map from [${partsFileName}]`);
        const partTagStr = partTagProvider(partsFileName);
        const partTagMatcher = (0, head_tail_matcher_1.createHeadTailMatcher)(partTagStr);
        const lines = await fileContentProvider(partsFileName);
        const parts = new Map();
        return new Promise((resolve, reject) => {
            (0, rxjs_1.from)(lines)
                .pipe(
            // split the lines by their part tags
            (0, split_if_1.splitIf)(s => partTagMatcher.test(s)), 
            //create a part record
            (0, rxjs_1.map)(lines => {
                const name = partTagMatcher.tail(lines[0]);
                if (name.length > 0 && !partNameRegexp.test(name)) {
                    throw new Error(`Invalid part name [${name}]`);
                }
                return {
                    name,
                    value: lines.slice(1),
                };
            }), 
            //do not allow part record with an empty name
            (0, rxjs_1.filter)(partRecord => partRecord.name.length > 0), 
            //add part record to a map
            (0, rxjs_1.scan)((acc, partRecord) => {
                log(`CREATE part [${partsFileName}][${partRecord.name}]`);
                return acc.set(partRecord.name, partRecord.value);
            }, parts))
                .subscribe({
                error: err => {
                    reject(err);
                },
                complete: () => {
                    if (parts.size === 0) {
                        reject(new Error(`No parts found in [${partsFileName}]`));
                    }
                    resolve(parts);
                },
            });
        });
    };
    return (0, cache_fn_1.cacheOneArgFnAsync)(_getMapFromFile);
};
exports.createPartMapProvider = createPartMapProvider;
//# sourceMappingURL=part_map_provider.js.map
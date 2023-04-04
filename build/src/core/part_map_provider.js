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
const first_matcher_1 = require("../utils/first_matcher");
const log = common_1.appLog.extend('partMapProvider');
const createPartMapProvider = (fileContentProvider, startCommentTagGetter, endCommentTagGetter, partNameRegexp
// partChar: string
) => {
    log('CREATE partMapProvider');
    const partChar = '<';
    const partNameMatcher = (0, first_matcher_1.createFirstMatcher)(partNameRegexp);
    const _getMapFromFile = async (partsFileName) => {
        log(`creating part map from [${partsFileName}]`);
        const startCommentStr = startCommentTagGetter(partsFileName);
        const endCommentStr = endCommentTagGetter(partsFileName);
        const markRegex = new RegExp(`^\\s*${startCommentStr}${partChar}\\s*(.*)$`);
        const lines = await fileContentProvider(partsFileName);
        const parts = new Map();
        return new Promise((resolve, reject) => {
            (0, rxjs_1.from)(lines)
                .pipe(
            // preserve line number
            (0, rxjs_1.map)((s, i) => ({ value: s, lineNumber: i + 1 })), 
            // split the lines by their part tags
            (0, split_if_1.splitIf)(s => markRegex.test(s.value)), 
            // create a part record
            (0, rxjs_1.map)(nLines => {
                const startLineNumber = nLines[0].lineNumber;
                const matches = nLines[0].value.match(markRegex) || [
                    '',
                    '',
                ];
                let partName = matches[1].trim();
                if (partName.length > 0 && partName === endCommentStr) {
                    // if a non empty end commment mark is right after the start comment mark, treat that as an anonymous part
                    partName = '';
                }
                if (partName.length > 0 && !partNameMatcher.test(partName)) {
                    throw new Error(`Create part from ("${(0, common_1.getFileLineInfoStr)(partsFileName, startLineNumber)}"): invalid value: (${partName})`);
                }
                return {
                    name: partNameMatcher.head(partName),
                    value: nLines.slice(1).map(ln => ln.value),
                    startLineNumber,
                };
            }), 
            //do not allow part record with an empty name
            (0, rxjs_1.filter)(partRecord => partRecord.name.length > 0), 
            //add part record to a map
            (0, rxjs_1.scan)((acc, partRecord) => {
                log(`CREATE part [${partsFileName}][${partRecord.name}]`);
                if (acc.has(partRecord.name)) {
                    throw new Error(`Duplicit part name (${partRecord.name}) in ("${(0, common_1.getFileLineInfoStr)(partsFileName, partRecord.startLineNumber)}")`);
                }
                return acc.set(partRecord.name, partRecord.value);
            }, parts))
                .subscribe({
                error: err => {
                    reject(err);
                },
                complete: () => {
                    if (parts.size === 0) {
                        reject(new Error(`No parts found in ("${partsFileName}")`));
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
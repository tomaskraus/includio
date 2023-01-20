"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMarkMapProvider = void 0;
const common_1 = require("./common");
const utils_1 = require("../utils");
const rxjs_1 = require("rxjs");
const stateful_predicates_1 = require("stateful-predicates");
const split_if_1 = require("split-if");
const comment_regexp_builder_1 = require("@krausoft/comment-regexp-builder");
const log = (0, common_1.logger)('includo:markMapProvider');
const createGetMarkNameFromLine = (tagName) => {
    const beginMarkTagInfo = (0, comment_regexp_builder_1.createStartTag)(tagName);
    return (line) => {
        const name = (0, utils_1.defaultValue)('')(beginMarkTagInfo.innerText(line)).trim();
        // if (name.length === 0) {
        //   throw new Error('Empty mark name!');
        // }
        return name;
    };
};
const createMarkMapProvider = (fileContentProvider, markTagProvider) => {
    log('CREATE markMapProvider');
    return async (marksFileName) => {
        log(`creating mark map from [${marksFileName}]`);
        const [beginMarkStr, endMarkStr] = markTagProvider(marksFileName);
        const beginMarkTagger = (0, comment_regexp_builder_1.createStartTag)(beginMarkStr);
        const endMarkTagger = (0, comment_regexp_builder_1.createStartTag)(endMarkStr); //We want use createStartTag, because endMarkStr must start at the beginning of line
        const getMarkNameFromLine = createGetMarkNameFromLine(beginMarkStr);
        const fileContent = await fileContentProvider(marksFileName);
        const marks = new Map();
        return new Promise((resolve, reject) => {
            (0, rxjs_1.from)(fileContent.split('\n'))
                .pipe((0, rxjs_1.filter)(
            // select only lines enclosed by beginMarkTag and endMarkTag. Include line with beginMarkTag
            (0, stateful_predicates_1.switchTrueFalse)(s => beginMarkTagger.test(s), s => endMarkTagger.test(s))), 
            // group the lines by their tags
            (0, split_if_1.splitIf)(s => beginMarkTagger.test(s)), 
            //create a mark record
            (0, rxjs_1.map)(lines => ({
                name: getMarkNameFromLine(lines[0]),
                value: lines.slice(1).join('\n'),
            })), 
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
};
exports.createMarkMapProvider = createMarkMapProvider;
//# sourceMappingURL=mark_map_provider.js.map
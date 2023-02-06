"use strict";
/**
 * commentTagProvider
 *
 * for a file name, returns a comment tag string fot that file type.
 * That string should be suitable to be included in regExp.
 * Comment tag string may include a % character
 *
 * @example
 ```ts
  const commentTagProvider = createCommentTagProvider(DEFAULT_INCLUDO_OPTIONS);
  commentTagProvider('ts') === '//';
  commentTagProvider('sh') === '#';
 ```
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommentTagProvider = void 0;
const common_1 = require("./common");
const log = common_1.appLog.extend('commentTagProvider');
const createCommentTagProvider = (options) => {
    log('CREATE commentTagProvider');
    return (fileNameExtension) => {
        const commantTag = '//';
        log(`comment tag for [${fileNameExtension}]: [${commantTag}]`);
        return commantTag;
    };
};
exports.createCommentTagProvider = createCommentTagProvider;
//# sourceMappingURL=comment_tag_provider.js.map
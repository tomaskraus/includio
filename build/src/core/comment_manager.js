"use strict";
/**
 * commentManager
 *
 * Provides right comment marks for a file name, based on its extension.
 *
 * @example
 ```ts
    const startCommentTagProvider = createCommentManager({DEFAULT_INCLUDIO_OPTIONS}).startTag;
    startCommentTagProvider('test.ts') === '//';
    startCommentTagProvider('anotherTest.sh') === '#';
 ```
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommentManager = void 0;
const common_1 = require("./common");
const node_path_1 = __importDefault(require("node:path"));
const log = common_1.appLog.extend('commentManager');
const createCommentManager = (options) => {
    log('CREATE commentManager');
    const defaultCommentPair = options.defaultCommentPair;
    const defaultStartComment = options.defaultCommentPair[0];
    const defaultEndComment = options.defaultCommentPair[1];
    const commentPairMap = options.commentPairMap.reduce((acc, [key, startComment, endComment]) => acc.set(key.toLowerCase(), [startComment, endComment]), new Map());
    log(`Extension map size: ${commentPairMap.size}`);
    return {
        defaultStartComment,
        defaultEndComment,
        startTag: (fileName) => {
            const extension = node_path_1.default.extname(fileName).slice(1).toLowerCase(); //remove leading dot
            const startCommentTag = (commentPairMap.get(extension) ||
                defaultCommentPair)[0];
            log(`start comment tag for [${fileName}] with extension [${extension}]: [${startCommentTag}]`);
            return startCommentTag;
        },
        endTag: (fileName) => {
            const extension = node_path_1.default.extname(fileName).slice(1).toLowerCase();
            const endCommentTag = (commentPairMap.get(extension) ||
                defaultCommentPair)[1];
            log(`end comment tag for [${fileName}] with extension [${extension}]: [${endCommentTag}]`);
            return endCommentTag;
        },
    };
};
exports.createCommentManager = createCommentManager;
//# sourceMappingURL=comment_manager.js.map
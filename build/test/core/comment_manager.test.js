"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../src/core/common");
const comment_manager_1 = require("../../src/core/comment_manager");
describe('Commentmanager', () => {
    const options = {
        ...common_1.DEFAULT_INCLUDO_OPTIONS,
        defaultCommentPair: ['--', '-'],
        commentPairMap: [
            ['js', '/*', '*/'],
            ['html', '<!--', '-->'],
        ],
    };
    const cm = (0, comment_manager_1.createCommentManager)(options);
    test('knows defaults', () => {
        expect(cm.defaultStartComment).toEqual('--');
        expect(cm.defaultEndComment).toEqual('-');
    });
    test('returns proper comments for filename with known extension', () => {
        expect(cm.startTag('test.js')).toEqual('/*');
        expect(cm.endTag('test.js')).toEqual('*/');
    });
    test('Is case insensitive. Returns proper comments for filename with known extension.', () => {
        expect(cm.startTag('test.JS')).toEqual('/*');
        expect(cm.endTag('test.JS')).toEqual('*/');
        expect(cm.startTag('test.Js')).toEqual('/*');
        expect(cm.endTag('test.jS')).toEqual('*/');
    });
    test('returns default comments for empty filename', () => {
        expect(cm.startTag('')).toEqual('--');
        expect(cm.endTag('')).toEqual('-');
    });
    test('returns default comments if extension is not found', () => {
        expect(cm.startTag('test.sql')).toEqual('--');
        expect(cm.endTag('test.sql')).toEqual('-');
    });
    test('returns default comments for filename with no extension', () => {
        expect(cm.startTag('js')).toEqual('--');
        expect(cm.endTag('js')).toEqual('-');
    });
});
//# sourceMappingURL=comment_manager.test.js.map
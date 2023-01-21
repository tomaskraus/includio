"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const includo_1 = require("./includo");
const common_1 = require("./core/common");
const node_process_1 = require("node:process");
const log = (0, common_1.logger)('includo:CLI');
(0, includo_1.createIncludoProcessor)({ baseDir: 'assets' })(node_process_1.stdin, node_process_1.stdout)
    .then(result => {
    log(`lines read: ${result.lineNumber}`);
})
    .catch(err => console.error(err));
//# sourceMappingURL=cli.js.map
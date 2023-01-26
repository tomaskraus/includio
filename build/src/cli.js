"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Includo command line app
 */
const commander_1 = require("commander");
const includo_1 = require("./includo");
const common_1 = require("./core/common");
const node_process_1 = require("node:process");
const default_value_1 = require("./utils/default_value");
const log = common_1.appLog.extend('CLI');
commander_1.program
    .option('-i --inputFile <string>')
    .option('-o --outputFile <string>')
    .option('-s --sourceDir <string>');
commander_1.program.parse();
const options = commander_1.program.opts();
(0, includo_1.createIncludoProcessor)({
    sourceDir: (0, default_value_1.defaultIfNullOrUndefined)('')(options.sourceDir),
})((0, default_value_1.defaultIfNullOrUndefined)(node_process_1.stdin)(options.inputFile), (0, default_value_1.defaultIfNullOrUndefined)(node_process_1.stdout)(options.outputFile))
    .then(result => {
    log(`lines read: ${result.lineNumber}`);
})
    .catch(err => console.error(err));
//# sourceMappingURL=cli.js.map
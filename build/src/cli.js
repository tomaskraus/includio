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
    .name('includo')
    .description('Inserts files (or their parts) into a text file.')
    .version((0, default_value_1.defaultIfNullOrUndefined)('-')(process.env.npm_package_version))
    .option('-i --inputFile <string>', 'File other files will be inserted into.' +
    '\nIf not specified, standard input will be used.')
    .option('-o --outputFile <string>', 'File where to output the result.' +
    '\nIf not specified, standard output will be used.')
    .option('-r --resourceDir <string>', 'Directory where to include files from.' +
    '\nIf not specified, current working dir (.) will be used.')
    .addHelpText('after', `
  Example: 
  includo -i README.template.md -o README.md -r assets`);
commander_1.program.parse();
const options = commander_1.program.opts();
(0, includo_1.createIncludoProcessor)({
    resourceDir: (0, default_value_1.defaultIfNullOrUndefined)('')(options.resourceDir),
})((0, default_value_1.defaultIfNullOrUndefined)(node_process_1.stdin)(options.inputFile), (0, default_value_1.defaultIfNullOrUndefined)(node_process_1.stdout)(options.outputFile)).then(result => {
    log(`lines read: ${result.lineNumber}`);
});
//# sourceMappingURL=cli.js.map
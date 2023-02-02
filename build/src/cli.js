"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Includo command line app
 */
const commander_1 = require("commander");
const includo_1 = require("./core/includo");
const common_1 = require("./core/common");
const node_process_1 = require("node:process");
const log = common_1.appLog.extend('CLI');
commander_1.program
    .name('includo')
    .description('Inserts files (or their parts) into a text file.')
    .version(process.env.npm_package_version || '-')
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
    resourceDir: options.resourceDir || '',
})(options.inputFile || node_process_1.stdin, options.outputFile || node_process_1.stdout).then(result => {
    log(`lines read: ${result.lineNumber}`);
});
//# sourceMappingURL=cli.js.map
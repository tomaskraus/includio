"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Includio command line app
 */
const commander_1 = require("commander");
const includio_1 = require("./core/includio");
const common_1 = require("./core/common");
const node_process_1 = require("node:process");
const log = common_1.appLog.extend('CLI');
commander_1.program
    .name('includio')
    .description('Creates the result by replacing every directive in the input template with the content of the resourceFile mentioned in that directive.')
    .version(process.env.npm_package_version || '-')
    .option('-i --inputFile <string>', 'The input template' + '\nIf not specified, standard input will be used.')
    .option('-o --outputFile <string>', 'A result file.' +
    '\nIf not specified, the result will be sent to a standard output.')
    .option('-r --resourceDir <string>', 'Directory where to look for resourceFiles.' +
    '\nIf not specified, current working dir (.) will be used.')
    .option('-t --test', 'Check the input template & its resourcFiles for possible errors.')
    .addHelpText('after', `
  Example: 
  includio -i README.template.md -o README.md -r assets`);
commander_1.program.parse();
const options = commander_1.program.opts();
const resourceDir = options.resourceDir || '';
const proc = (() => {
    if (options.test) {
        return (0, includio_1.createTestIncludioProcessor)({
            resourceDir,
        });
    }
    return (0, includio_1.createIncludioProcessor)({
        resourceDir,
    });
})();
proc(options.inputFile || node_process_1.stdin, options.outputFile || node_process_1.stdout).then(result => {
    console.error(''); // just enters a new line at console
    log(`lines read: ${result.lineNumber}`);
});
//# sourceMappingURL=cli.js.map
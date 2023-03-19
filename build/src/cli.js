"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Includio command line app
 */
const commander_1 = require("commander");
const node_path_1 = require("node:path");
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
    .option('-r --resourceDir <string>', 'Directory where to look for resourceFiles.', common_1.DEFAULT_INCLUDIO_OPTIONS.resourceDir)
    .option('-t --test', 'Check the input template & its resourcFiles for possible errors.')
    .addHelpText('after', `
  Example: 
  includio -i README.template.md -o README.md -r assets`);
commander_1.program.parse();
const options = commander_1.program.opts();
console.error(`Includio: resource dir: "${(0, node_path_1.resolve)(options.resourceDir)}"`);
const proc = (() => {
    if (options.test) {
        return (0, includio_1.createTestIncludioProcessor)({
            resourceDir: options.resourceDir,
        });
    }
    return (0, includio_1.createIncludioProcessor)({
        resourceDir: options.resourceDir,
    });
})();
if (options.inputFile) {
    const finalPath = (0, node_path_1.resolve)(options.inputFile);
    console.error(`Includio: reading from: "${finalPath}"`);
}
proc(options.inputFile || node_process_1.stdin, options.outputFile || node_process_1.stdout).then(result => {
    if (options.outputFile) {
        console.error(`Includio: saving result to: "${(0, node_path_1.resolve)(options.outputFile)}"`);
    }
    console.error(''); // just enters a new line at console
    log(`lines read: ${result.lineNumber}`);
});
//# sourceMappingURL=cli.js.map
/**
 * Includio command line app
 */
import {program} from 'commander';
import {resolve} from 'node:path';

import {
  createIncludioProcessor,
  createTestIncludioProcessor,
  createListIncludioProcessor,
} from './core/includio';
import {appLog, DEFAULT_INCLUDIO_OPTIONS} from './core/common';

import {stdin, stdout} from 'node:process';

const log = appLog.extend('CLI');

program
  .name('includio')
  .description(
    "Creates the result output by replacing every directive in the input template with the content of the directive's resource file or its part."
  )
  .version(process.env.npm_package_version || '-')
  .option(
    '-i --inputFile <string>',
    'The input template' + '\nIf not specified, standard input will be used.'
  )
  .option(
    '-o --outputFile <string>',
    'A result file.' +
      '\nIf not specified, the result will be sent to a standard output.'
  )
  .option(
    '-r --resourceDir <string>',
    'Directory where to look for resourceFiles.',
    DEFAULT_INCLUDIO_OPTIONS.resourceDir
  )
  .option('-t --test', 'Check the input template for errors.')
  .option('-l --list', 'Lists all directives in the input.')
  .addHelpText(
    'after',
    `
  Example: 
  includio -i README.template.md -o README.md -r assets`
  );

program.parse();
const AppOptions = program.opts();

console.error(`Includio: resource dir: "${resolve(AppOptions.resourceDir)}"`);

const opts = {
  resourceDir: AppOptions.resourceDir,
};

const proc = (() => {
  if (AppOptions.test) {
    return createTestIncludioProcessor(opts);
  }
  if (AppOptions.list) {
    return createListIncludioProcessor(opts);
  }
  return createIncludioProcessor(opts);
})();

if (AppOptions.inputFile) {
  const finalPath = resolve(AppOptions.inputFile);
  console.error(`Includio: reading from: "${finalPath}"`);
}

proc
  .lineMachine(AppOptions.inputFile || stdin, AppOptions.outputFile || stdout)
  .then(result => {
    if (AppOptions.outputFile) {
      console.error(
        `Includio: saving result to: "${resolve(AppOptions.outputFile)}"`
      );
    }
    console.error(''); // just enters a new line at console
    log(`lines read: ${result.lineNumber}`);
    log(`err count: ${proc.getErrorCount()}`);
    if (proc.getErrorCount() > 0) {
      throw new Error(`${proc.getErrorCount()} errors total.`);
    }
  });

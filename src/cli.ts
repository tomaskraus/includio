/**
 * Includo command line app
 */
import {program} from 'commander';

import {createIncludoProcessor} from './core/includo';
import {appLog} from './core/common';

import {stdin, stdout} from 'node:process';

const log = appLog.extend('CLI');

program
  .name('includo')
  .description('Inserts files (or their parts) into a text file.')
  .version(process.env.npm_package_version || '-')
  .option(
    '-i --inputFile <string>',
    'File other files will be inserted into.' +
      '\nIf not specified, standard input will be used.'
  )
  .option(
    '-o --outputFile <string>',
    'File where to output the result.' +
      '\nIf not specified, standard output will be used.'
  )
  .option(
    '-r --resourceDir <string>',
    'Directory where to include files from.' +
      '\nIf not specified, current working dir (.) will be used.'
  )
  .addHelpText(
    'after',
    `
  Example: 
  includo -i README.template.md -o README.md -r assets`
  );

program.parse();
const options = program.opts();

createIncludoProcessor({
  resourceDir: options.resourceDir || '',
})(options.inputFile || stdin, options.outputFile || stdout).then(result => {
  log(`lines read: ${result.lineNumber}`);
});

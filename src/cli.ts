/**
 * Includio command line app
 */
import {program} from 'commander';

import {
  createIncludioProcessor,
  createTestIncludioProcessor,
} from './core/includio';
import {appLog} from './core/common';

import {stdin, stdout} from 'node:process';

const log = appLog.extend('CLI');

program
  .name('includio')
  .description(
    'Creates the result by replacing every directive in the input template with the content of the resourceFile mentioned in that directive.'
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
    'Directory where to look for resourceFiles.' +
      '\nIf not specified, current working dir (.) will be used.'
  )
  .option(
    '-t --test',
    'Check the input template & its resourcFiles for possible errors.'
  )
  .addHelpText(
    'after',
    `
  Example: 
  includio -i README.template.md -o README.md -r assets`
  );

program.parse();
const options = program.opts();

const resourceDir = options.resourceDir || '';

const proc = (() => {
  if (options.test) {
    return createTestIncludioProcessor({
      resourceDir,
    });
  }
  return createIncludioProcessor({
    resourceDir,
  });
})();

proc(options.inputFile || stdin, options.outputFile || stdout).then(result => {
  console.error(''); // just enters a new line at console
  log(`lines read: ${result.lineNumber}`);
});

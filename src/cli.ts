/**
 * Includo command line app
 */
import {program} from 'commander';
import stream from 'stream';

import {createIncludoProcessor} from './includo';
import {appLog} from './core/common';

import {stdin, stdout} from 'node:process';
import {defaultIfNullOrUndefined} from './utils/default_value';

const log = appLog.extend('CLI');

program
  .name('includo')
  .description('Inserts files (or their parts) into a text file.')
  .version(defaultIfNullOrUndefined('-')(process.env.npm_package_version))
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
  resourceDir: defaultIfNullOrUndefined('')(options.resourceDir),
})(
  defaultIfNullOrUndefined<string | stream.Readable>(stdin)(options.inputFile),
  defaultIfNullOrUndefined<string | stream.Writable>(stdout)(options.outputFile)
)
  .then(result => {
    log(`lines read: ${result.lineNumber}`);
  })
  .catch(err => console.error(err));

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
  .option('-i --inputFile <string>')
  .option('-o --outputFile <string>')
  .option('-s --sourceDir <string>');

program.parse();
const options = program.opts();

createIncludoProcessor({
  sourceDir: defaultIfNullOrUndefined('')(options.sourceDir),
})(
  defaultIfNullOrUndefined<string | stream.Readable>(stdin)(options.inputFile),
  defaultIfNullOrUndefined<string | stream.Writable>(stdout)(options.outputFile)
)
  .then(result => {
    log(`lines read: ${result.lineNumber}`);
  })
  .catch(err => console.error(err));

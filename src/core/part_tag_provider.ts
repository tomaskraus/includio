/**
 * partTagProvider
 *
 * for a file name, returns a pair [opening, closing] parts fot that file type.
 */

import {TIncludoOptions, appLog} from './common';

const log = appLog.extend('partTagProvider');

export const createPartTagProvider = (options: TIncludoOptions) => {
  log('CREATE partTagProvider');

  return (fileName: string): string => {
    const tag = '//<';
    log(`part tag for [${fileName}]: [${tag}]`);
    return tag;
  };
};

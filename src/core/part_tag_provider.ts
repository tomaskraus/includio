/**
 * partTagProvider
 *
 * for a file name, returns a pair [opening, closing] parts fot that file type.
 */

import {TIncludoOptions, appLog} from './common';

const log = appLog.extend('partTagProvider');

export type TpartTag = [string, string];

export const createPartTagProvider = (options: TIncludoOptions) => {
  log('CREATE partTagProvider');

  return (fileName: string): TpartTag => {
    const tags: [string, string] = ['//<', '//>'];
    log(`part tags for [${fileName}]: [${tags[0]}],[${tags[1]}]`);
    return tags;
  };
};

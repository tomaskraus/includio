/**
 * MarkTagProvider
 *
 * for a file name, returns a pair [opening, closing] marks fot that file type.
 */

import {TIncludoOptions, appLog} from './common';

const log = appLog.extend('markTagProvider');

export type TMarkTag = [string, string];

export const createMarkTagProvider = (options: TIncludoOptions) => {
  log('CREATE markTagProvider');

  return (fileName: string): TMarkTag => {
    const tags: [string, string] = ['//<', '//>'];
    log(`mark tags for [${fileName}]: [${tags[0]}],[${tags[1]}]`);
    return tags;
  };
};

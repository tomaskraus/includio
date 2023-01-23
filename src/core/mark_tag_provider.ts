import {TIncludoOptions, appLog} from './common';

const log = appLog.extend('markTagProvider');

export type TMarkTag = [string, string];

export const createMarkTagProvider = (options: TIncludoOptions) => {
  log('CREATE markTagProvider');

  return (markFileName: string): TMarkTag => {
    const tags: [string, string] = ['//<', '//>'];
    log(`mark tags for [${markFileName}]: [${tags[0]}],[${tags[1]}]`);
    return tags;
  };
};

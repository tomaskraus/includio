import {TIncludoOptions, logger} from './common';

const log = logger('includo:markTagProvider');

export type TMarkTag = [string, string];

export const createMarkTagProvider = (options: TIncludoOptions) => {
  log('CREATE markTagProvider');

  return (fileName: string): TMarkTag => {
    return ['//<', '//>'];
  };
};

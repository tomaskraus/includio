import {createStartTag} from '@krausoft/comment-regexp-builder';
import {defaultIfNullOrUndefined} from './utils';
import {createAsyncLineMachine} from 'line-transform-machines';
import type {TAsyncLineCallback} from 'line-transform-machines';
import {createInsertionDispatcher} from './core/insertion_dispatcher';
import {DEFAULT_INCLUDO_OPTIONS, logger} from './core/common';
import type {TIncludoOptions} from './core/common';

const log = logger('includo:includo');

export {DEFAULT_INCLUDO_OPTIONS};

const createIncludoLineCallback = (
  options: TIncludoOptions
): TAsyncLineCallback => {
  const tagForInsert = createStartTag(options.tagInsert);
  const insertionDispatcher = createInsertionDispatcher(options);
  log(`CREATE includoCallback for tag [${options.tagInsert}] `);
  return (line: string): Promise<string> => {
    if (tagForInsert.test(line)) {
      return insertionDispatcher(
        defaultIfNullOrUndefined('')(tagForInsert.innerText(line)).trim()
      );
    }
    return Promise.resolve(line);
  };
};

export const createIncludoProcessor = (options?: Partial<TIncludoOptions>) => {
  const opts = {...DEFAULT_INCLUDO_OPTIONS, ...options};
  log('CREATE includo engine');
  return createAsyncLineMachine(createIncludoLineCallback(opts));
};

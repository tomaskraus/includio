import {createStartTag} from '@krausoft/comment-regexp-builder';
import {defaultValue} from './utils';
import {createAsyncLineMachine} from 'line-transform-machines';
import {createInsertionDispatcher} from './core/insertion_dispatcher';
import {DEFAULT_INCLUDO_OPTIONS} from './core/common';
import type {
  TFileProcessor,
  TFileLineContext,
  TAsyncLineCallback,
} from 'line-transform-machines';
import type {TIncludoOptions} from './core/common';

export {DEFAULT_INCLUDO_OPTIONS};

const includerCB = (options: TIncludoOptions): TAsyncLineCallback => {
  const tagForInsert = createStartTag(options.tagInsert);
  const insertionDispatcher = createInsertionDispatcher(options);
  return (line: string): Promise<string> => {
    if (tagForInsert.test(line)) {
      return insertionDispatcher(
        defaultValue('')(tagForInsert.innerText(line)).trim()
      );
    }
    return Promise.resolve(line);
  };
};

export const createIncludoProcessor = (
  options?: Partial<TIncludoOptions>
): TFileProcessor<TFileLineContext> => {
  const opts = {...DEFAULT_INCLUDO_OPTIONS, options};

  return createAsyncLineMachine(includerCB(opts));
};

import {createStartTag} from '@krausoft/comment-regexp-builder';
import {defaultValue} from './utils';
import {createLineMachine} from 'line-transform-machines';
import {insertionFileDispatcher} from './core/insertion_dispatcher';
import {DEFAULT_INCLUDO_OPTIONS} from './core/common';
import type {
  TFileProcessor,
  TFileLineContext,
  TLineCallback,
} from 'line-transform-machines';
import type {TIncludoOptions} from './core/common';

export {DEFAULT_INCLUDO_OPTIONS};

const includerCB = (options: TIncludoOptions): TLineCallback => {
  const tagForInsert = createStartTag(options.tag_insert);
  return (line: string): string => {
    if (tagForInsert.test(line)) {
      return insertionFileDispatcher(
        defaultValue('')(tagForInsert.innerText(line)).trim()
      );
    }
    return line;
  };
};

export const createIncludoProcessor = (
  options?: Partial<TIncludoOptions>
): TFileProcessor<TFileLineContext> => {
  const opts = {...DEFAULT_INCLUDO_OPTIONS, options};

  return createLineMachine(includerCB(opts));
};

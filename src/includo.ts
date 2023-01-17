import {createStartTag} from '@krausoft/comment-regexp-builder';
import {defaultValue} from './utils';
import {createLineMachine} from 'line-transform-machines';
import type {
  TFileProcessor,
  TFileLineContext,
  TLineCallback,
} from 'line-transform-machines';

export type TIncludoOptions = {
  tag_insert: string;
};

export const DEFAULT_INCLUDO_OPTIONS: TIncludoOptions = {
  tag_insert: '@@',
};

const insertionDispatcher = (command: string): string => {
  if (command.length === 0) {
    throw new Error('empty tag not allowed!');
  }
  return '--insertion--';
};

const includerCB = (options: TIncludoOptions): TLineCallback => {
  const tagForInsert = createStartTag(options.tag_insert);
  const safeTagInnerText = defaultValue('', tagForInsert.innerText);
  return (line: string): string => {
    if (tagForInsert.test(line)) {
      return insertionDispatcher(safeTagInnerText(line).trim());
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

import * as crb from '@krausoft/comment-regexp-builder';
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

const includerCB = (options: TIncludoOptions): TLineCallback => {
  const tagForInsert = crb.createStartTag(options.tag_insert);
  return (line: string): string | null => {
    if (tagForInsert.test(line)) {
      throw new Error('EEE!');
      //return '---insert!----\n---code!------\n';
    }
    return `*-* ${line}\n`;
  };
};

export const createIncludoProcessor = (
  options?: Partial<TIncludoOptions>
): TFileProcessor<TFileLineContext> => {
  const opts = {...DEFAULT_INCLUDO_OPTIONS, options};

  return createLineMachine(includerCB(opts));
};

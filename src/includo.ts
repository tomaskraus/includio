import type {TLineMapFn} from './utils/streamlinetransformer';
import * as crb from '@krausoft/comment-regexp-builder';

export type TIncludoOptions = {
  tag_insert: string;
};

export const DEFAULT_INCLUDO_OPTIONS: TIncludoOptions = {
  tag_insert: '@@',
};

export const createIncludoProcessor = (
  options?: Partial<TIncludoOptions>
): TLineMapFn => {
  const opts = {...DEFAULT_INCLUDO_OPTIONS, options};
  const tagForInsert = crb.createStartTag(opts.tag_insert);
  return async (line: string): Promise<string> => {
    if (tagForInsert.test(line)) {
      return '---insert!----\n---code!------\n';
    }
    return `*-* ${line}\n`;
  };
};

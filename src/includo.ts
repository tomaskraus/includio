import type {TLineMapFn} from './utils/streamlinetransformer';

export type TIncludoOptions = {
  tag_insert: string;
};

export const DEFAULT_INCLUDO_OPTIONS: TIncludoOptions = {
  tag_insert: '@@',
};

export const createIncludoProcessor = (
  options?: TIncludoOptions
): TLineMapFn => {
  return async (line: string): Promise<string> => {
    return `*-* ${line}\n`;
  };
};

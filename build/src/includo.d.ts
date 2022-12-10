import type { TLineMapFn } from './utils/streamlinetransformer';
export type TIncludoOptions = {
    tag_insert: string;
};
export declare const DEFAULT_INCLUDO_OPTIONS: TIncludoOptions;
export declare const createIncludoProcessor: (options?: Partial<TIncludoOptions>) => TLineMapFn;

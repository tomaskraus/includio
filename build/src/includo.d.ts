import type { TFileProcessor, TFileLineContext } from 'line-transform-machines';
export type TIncludoOptions = {
    tag_insert: string;
};
export declare const DEFAULT_INCLUDO_OPTIONS: TIncludoOptions;
export declare const createIncludoProcessor: (options?: Partial<TIncludoOptions>) => TFileProcessor<TFileLineContext>;

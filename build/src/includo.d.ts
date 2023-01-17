import { DEFAULT_INCLUDO_OPTIONS } from './core/common';
import type { TFileProcessor, TFileLineContext } from 'line-transform-machines';
import type { TIncludoOptions } from './core/common';
export { DEFAULT_INCLUDO_OPTIONS };
export declare const createIncludoProcessor: (options?: Partial<TIncludoOptions>) => TFileProcessor<TFileLineContext>;

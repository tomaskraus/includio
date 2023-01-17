import { DEFAULT_INCLUDO_OPTIONS } from './core/common';
import type { TIncludoOptions } from './core/common';
export { DEFAULT_INCLUDO_OPTIONS };
export declare const createIncludoProcessor: (options?: Partial<TIncludoOptions>) => import("line-transform-machines").TFileProcessor<import("line-transform-machines").TFileLineContext>;

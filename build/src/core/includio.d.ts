/**
 * IncludioProcessor
 *
 * Reads input (from file/stream) line by line and replaces tagged lines with some content.
 *   Source of that content and further instructions are written on that tagged line.
 * Writes the result to the output (file/stream).
 */
import { TFileLineContext, TFileProcessor } from 'line-transform-machines';
import { DEFAULT_INCLUDIO_OPTIONS } from './common';
import type { TIncludioOptions } from './common';
export { DEFAULT_INCLUDIO_OPTIONS };
type TIncludioCallbacks = {
    directiveLine: (line: string) => Promise<string | null>;
};
export declare const createIncludioProcessor: (options?: Partial<TIncludioOptions>, callbacks?: Partial<TIncludioCallbacks>) => TFileProcessor<TFileLineContext>;
export declare const createTestIncludioProcessor: (options?: Partial<TIncludioOptions>) => TFileProcessor<TFileLineContext>;

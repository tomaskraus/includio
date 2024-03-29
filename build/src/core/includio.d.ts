/**
 * IncludioProcessor
 *
 * Reads input (from file/stream) line by line and replaces 'directive lines' with some content.
 * A directive line starts with a '@@' mark.
 *   Source of that content and further instructions are written on that directive line.
 * Writes the result to the output (file/stream).
 */
import { TFileLineContext, TFileProcessor } from 'line-transform-machines';
import { DEFAULT_INCLUDIO_OPTIONS } from './common';
import type { TIncludioOptions } from './common';
export { DEFAULT_INCLUDIO_OPTIONS };
type TIncludioProcessor = {
    lineMachine: TFileProcessor<TFileLineContext>;
    getErrorCount: () => number;
};
export declare const createIncludioProcessor: (options?: Partial<TIncludioOptions>) => TIncludioProcessor;
export declare const createTestIncludioProcessor: (options?: Partial<TIncludioOptions>) => TIncludioProcessor;
export declare const createListIncludioProcessor: (options?: Partial<TIncludioOptions>) => TIncludioProcessor;

/**
 * IncludoProcessor
 *
 * Reads input (from file/stream) line by line and replaces tagged lines with some content.
 *   Source of that content and further instructions are written on that tagged line.
 * Writes the result to the output (file/stream).
 */
import { TFileLineContext, TFileProcessor } from 'line-transform-machines';
import { DEFAULT_INCLUDO_OPTIONS } from './core/common';
import type { TIncludoOptions } from './core/common';
export { DEFAULT_INCLUDO_OPTIONS };
export declare const createIncludoProcessor: (options?: Partial<TIncludoOptions>) => TFileProcessor<TFileLineContext>;

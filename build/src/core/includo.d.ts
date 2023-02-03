/**
 * IncludoProcessor
 *
 * Reads input (from file/stream) line by line and replaces tagged lines with some content.
 *   Source of that content and further instructions are written on that tagged line.
 * Writes the result to the output (file/stream).
 */
import { TFileLineContext, TFileProcessor } from 'line-transform-machines';
import { DEFAULT_INCLUDO_OPTIONS } from './common';
import type { TIncludoOptions } from './common';
export { DEFAULT_INCLUDO_OPTIONS };
export declare const createIncludoProcessor: (options?: Partial<TIncludoOptions>) => TFileProcessor<TFileLineContext>;
export declare const createTestIncludoProcessor: (options?: Partial<TIncludoOptions>) => TFileProcessor<TFileLineContext>;

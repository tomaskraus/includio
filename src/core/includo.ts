/**
 * IncludoProcessor
 *
 * Reads input (from file/stream) line by line and replaces tagged lines with some content.
 *   Source of that content and further instructions are written on that tagged line.
 * Writes the result to the output (file/stream).
 */

import {
  TFileLineContext,
  TFileProcessor,
  createAsyncLineMachine,
} from 'line-transform-machines';
import type {TAsyncLineCallback} from 'line-transform-machines';
import {createInsertionDispatcher} from './insertion_dispatcher';
import {DEFAULT_INCLUDO_OPTIONS, appLog} from './common';
import type {TIncludoOptions} from './common';
import {createHeadTailMatcher} from '../utils/head_tail_matcher';

const log = appLog.extend('processor');

export {DEFAULT_INCLUDO_OPTIONS};

const createIncludoLineCallback = (
  options: TIncludoOptions
): TAsyncLineCallback => {
  const insertionTagMatcher = createHeadTailMatcher(options.tagInsert);
  const insertionDispatcher = createInsertionDispatcher(options);
  log(`CREATE includoCallback for tag [${options.tagInsert}] `);

  return (line: string): Promise<string> => {
    if (insertionTagMatcher.test(line)) {
      return insertionDispatcher(insertionTagMatcher.tail(line));
    }
    return Promise.resolve(line);
  };
};

export const createIncludoProcessor = (
  options?: Partial<TIncludoOptions>
): TFileProcessor<TFileLineContext> => {
  const opts = {...DEFAULT_INCLUDO_OPTIONS, ...options};
  log('CREATE includo processor');
  return createAsyncLineMachine(createIncludoLineCallback(opts));
};
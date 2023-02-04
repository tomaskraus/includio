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
import {createHeadTailMatcherOld} from '../utils/head_tail_matcher_old';

const log = appLog.extend('processor');

export {DEFAULT_INCLUDO_OPTIONS};

const createIncludoLineCallback = (
  options: TIncludoOptions
): TAsyncLineCallback => {
  const insertionTagMatcher = createHeadTailMatcherOld(options.tagInsert);
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

const createTestIncludoLineCallback = (
  options: TIncludoOptions
): TAsyncLineCallback => {
  const insertionTagMatcher = createHeadTailMatcherOld(options.tagInsert);
  const insertionDispatcher = createInsertionDispatcher(options);
  log(`CREATE testIncludoCallback for tag [${options.tagInsert}] `);

  return async (
    line: string,
    lineNumber: number,
    fileLineInfo?: string
  ): Promise<string | null> => {
    if (insertionTagMatcher.test(line)) {
      try {
        await insertionDispatcher(insertionTagMatcher.tail(line));
      } catch (e) {
        const flinfoStr = fileLineInfo || '';
        return `"${flinfoStr}" ; ${(e as Error).message}`;
      }
    }
    return null;
  };
};

export const createTestIncludoProcessor = (
  options?: Partial<TIncludoOptions>
): TFileProcessor<TFileLineContext> => {
  const opts = {...DEFAULT_INCLUDO_OPTIONS, ...options};
  log('CREATE testIncludo processor');
  return createAsyncLineMachine(createTestIncludoLineCallback(opts));
};

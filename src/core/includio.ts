/**
 * IncludioProcessor
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
import {DEFAULT_INCLUDIO_OPTIONS, appLog} from './common';
import type {TIncludioOptions} from './common';
import {createFirstMatcher} from '../utils/first_matcher';

const log = appLog.extend('processor');

export {DEFAULT_INCLUDIO_OPTIONS};

const createIncludioLineCallback = (
  options: TIncludioOptions
): TAsyncLineCallback => {
  const insertionTagMatcher = createFirstMatcher(options.tagInsert);
  const insertionDispatcher = createInsertionDispatcher(options);
  log(`CREATE includioCallback for tag [${options.tagInsert}] `);

  return (line: string): Promise<string> => {
    if (insertionTagMatcher.test(line)) {
      return insertionDispatcher(insertionTagMatcher.tail(line));
    }
    return Promise.resolve(line);
  };
};

export const createIncludioProcessor = (
  options?: Partial<TIncludioOptions>
): TFileProcessor<TFileLineContext> => {
  const opts = {...DEFAULT_INCLUDIO_OPTIONS, ...options};
  log('CREATE includio processor');
  return createAsyncLineMachine(createIncludioLineCallback(opts));
};

const createTestIncludioLineCallback = (
  options: TIncludioOptions
): TAsyncLineCallback => {
  const insertionTagMatcher = createFirstMatcher(options.tagInsert);
  const insertionDispatcher = createInsertionDispatcher(options);
  log(`CREATE testIncludioCallback for tag [${options.tagInsert}] `);

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

export const createTestIncludioProcessor = (
  options?: Partial<TIncludioOptions>
): TFileProcessor<TFileLineContext> => {
  const opts = {...DEFAULT_INCLUDIO_OPTIONS, ...options};
  log('CREATE testIncludio processor');
  return createAsyncLineMachine(createTestIncludioLineCallback(opts));
};

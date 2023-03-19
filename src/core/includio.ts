/**
 * IncludioProcessor
 *
 * Reads input (from file/stream) line by line and replaces tagged lines with some content.
 *   Source of that content and further instructions are written on that tagged line.
 * Writes the result to the output (file/stream).
 */

import {
  LineMachineError,
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

type TIncludioCallbacks = {
  directiveLine: (line: string) => Promise<string | null>;
  // normalLine: TAsyncLineCallback;
  // errorHandler: (lineError: LineMachineError) => string;
};

const createDefaultDirectiveLineCB = (options: TIncludioOptions) => {
  const insertionDispatcher = createInsertionDispatcher(options);
  return async (line: string): Promise<string | null> => {
    return insertionDispatcher(line);
  };
};

// const DEFAULT_INCLUDIO_CALLBACKS: TIncludioCallbacks = {
//   directiveLine:
// };

export const createIncludioProcessor = (
  options?: Partial<TIncludioOptions>,
  callbacks?: Partial<TIncludioCallbacks>
): TFileProcessor<TFileLineContext> => {
  log('CREATE includio processor');
  const opts: TIncludioOptions = {...DEFAULT_INCLUDIO_OPTIONS, ...options};
  const cbks: TIncludioCallbacks = {
    directiveLine: createDefaultDirectiveLineCB(opts),
  };

  const insertionTagMatcher = createFirstMatcher(opts.tagInsert);

  const cb = async (line: string): Promise<string | null> => {
    if (insertionTagMatcher.test(line)) {
      return cbks.directiveLine(insertionTagMatcher.tail(line));
    }
    return line;
  };

  return createAsyncLineMachine(cb);
};

// export const createIncludioProcessor = (
//   options?: Partial<TIncludioOptions>
// ): TFileProcessor<TFileLineContext> => {

//   return createAsyncLineMachine(createIncludioLineCallback1(opts));
// };

//--------------------------------------------------------

// const createIncludioLineCallback1 = (
//   options: TIncludioOptions
// ): TAsyncLineCallback => {
//   const insertionTagMatcher = createFirstMatcher(options.tagInsert);
//   const insertionDispatcher = createInsertionDispatcher(options);
//   log(`CREATE includioCallback for tag [${options.tagInsert}] `);

//   return async (line: string): Promise<string> => {
//     if (insertionTagMatcher.test(line)) {
//       return insertionDispatcher(insertionTagMatcher.tail(line));
//     }
//     return Promise.resolve(line);
//   };
// };

// export const createIncludioProcessor1 = (
//   options?: Partial<TIncludioOptions>
// ): TFileProcessor<TFileLineContext> => {
//   const opts = {...DEFAULT_INCLUDIO_OPTIONS, ...options};
//   log('CREATE includio processor');
//   return createAsyncLineMachine(createIncludioLineCallback1(opts));
// };

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

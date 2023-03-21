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
import {DEFAULT_INCLUDIO_OPTIONS, appLog, mergeIncludioOptions} from './common';
import type {TIncludioOptions} from './common';
import {createFirstMatcher} from '../utils/first_matcher';

const log = appLog.extend('processor');

export {DEFAULT_INCLUDIO_OPTIONS};

type TIncludioCallbacks = {
  directiveLine: (
    line: string,
    fileLineInfo?: string
  ) => Promise<string | null>;
  normalLine: (line: string, fileLineInfo?: string) => Promise<string | null>;
  errorHandler: (err: Error, fileLineInfo?: string) => string;
};

const makeIncludioProcessor = (
  includioCallbacks: TIncludioCallbacks,
  options: TIncludioOptions
): TFileProcessor<TFileLineContext> => {
  const directiveMatcher = createFirstMatcher(options.directiveTag);
  const callback: TAsyncLineCallback = async (
    line: string,
    lineNumber: number,
    fileLineInfo?: string
  ): Promise<string | null> => {
    if (directiveMatcher.test(line)) {
      try {
        return await includioCallbacks.directiveLine(
          directiveMatcher.tail(line),
          fileLineInfo
        );
      } catch (e) {
        return includioCallbacks.errorHandler(e as Error, fileLineInfo);
      }
    }
    return includioCallbacks.normalLine(line, fileLineInfo);
  };

  log('make Includio processor');
  return createAsyncLineMachine(callback);
};

// =====================

const createDispatchDirectiveLineCB = (options: TIncludioOptions) => {
  const insertionDispatcher = createInsertionDispatcher(options);
  return async (line: string): Promise<string | null> => {
    return await insertionDispatcher(line);
  };
};

const createSilentDispatchDirectiveLineCB = (options: TIncludioOptions) => {
  const insertionDispatcher = createInsertionDispatcher(options);
  return async (line: string): Promise<string | null> => {
    await insertionDispatcher(line);
    return null;
  };
};

const printDirectiveLineCB = async (
  line: string,
  fileLineInfo?: string
): Promise<string | null> => {
  const flinfoStr = fileLineInfo || '';
  return `"${flinfoStr}" ; ${line}`;
};

const identityLineCB = async (line: string) => line;

const nullLineCB = async () => null;

const printErrorHandlerCB = (err: Error, fileLineInfo?: string) => {
  const flinfoStr = fileLineInfo || '';
  return `"${flinfoStr}" ; ${err.message}`;
};

const raiseErrorHandlerCB = (err: Error) => {
  throw err;
};

// --------------

export const createIncludioProcessor = (
  options?: Partial<TIncludioOptions>
): TFileProcessor<TFileLineContext> => {
  const opts = mergeIncludioOptions(options);
  log('CREATE Includio processor');
  return makeIncludioProcessor(
    {
      directiveLine: createDispatchDirectiveLineCB(opts),
      normalLine: identityLineCB,
      errorHandler: raiseErrorHandlerCB,
    },
    opts
  );
};

// ----------------

export const createTestIncludioProcessor = (
  options?: Partial<TIncludioOptions>
): TFileProcessor<TFileLineContext> => {
  const opts = mergeIncludioOptions(options);
  log('CREATE testIncludio processor');
  return makeIncludioProcessor(
    {
      directiveLine: createSilentDispatchDirectiveLineCB(opts),
      normalLine: nullLineCB,
      errorHandler: printErrorHandlerCB,
    },
    opts
  );
};

// ------------------

export const createListIncludioProcessor = (
  options?: Partial<TIncludioOptions>
): TFileProcessor<TFileLineContext> => {
  const opts = mergeIncludioOptions(options);
  log('CREATE linkIncludio processor');
  return makeIncludioProcessor(
    {
      directiveLine: printDirectiveLineCB,
      normalLine: nullLineCB,
      errorHandler: printErrorHandlerCB,
    },
    opts
  );
};

/**
 * IncludioProcessor
 *
 * Reads input (from file/stream) line by line and replaces 'directive lines' with some content.
 * A directive line starts with a '@@' mark.
 *   Source of that content and further instructions are written on that directive line.
 * Writes the result to the output (file/stream).
 */

import {
  TFileLineContext,
  TFileProcessor,
  createAsyncLineMachine,
} from 'line-transform-machines';
import type {TAsyncLineCallback} from 'line-transform-machines';
import {createDirectiveHandler} from './directive_handler';
import {DEFAULT_INCLUDIO_OPTIONS, appLog, mergeIncludioOptions} from './common';
import type {TIncludioOptions} from './common';
import {createFirstMatcher} from '../utils/first_matcher';

const log = appLog.extend('processor');

export {DEFAULT_INCLUDIO_OPTIONS};

type TIncludioCallbacks = {
  directiveLineCB: (
    line: string,
    fileLineInfo?: string
  ) => Promise<string | null>;
  normalLineCB: (line: string, fileLineInfo?: string) => Promise<string | null>;
  errorCB: (err: Error, fileLineInfo?: string) => string;
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
        return await includioCallbacks.directiveLineCB(line, fileLineInfo);
      } catch (e) {
        return includioCallbacks.errorCB(e as Error, fileLineInfo);
      }
    }
    return includioCallbacks.normalLineCB(line, fileLineInfo);
  };

  log('make Includio processor');
  return createAsyncLineMachine(callback);
};

// =====================

const createSilenDirectiveHandler = (options: TIncludioOptions) => {
  const insertionDispatcher = createDirectiveHandler(options);
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

const printErrorCB = (err: Error, fileLineInfo?: string) => {
  const flinfoStr = fileLineInfo || '';
  return `"${flinfoStr}" ; ${err.message}`;
};

const raiseErrorCB = (err: Error) => {
  throw err;
};

// = = = = = = = = = = = = = = = = = = = = =

export const createIncludioProcessor = (
  options?: Partial<TIncludioOptions>
): TFileProcessor<TFileLineContext> => {
  const opts = mergeIncludioOptions(options);
  log('CREATE Includio processor');
  return makeIncludioProcessor(
    {
      directiveLineCB: createDirectiveHandler(opts),
      normalLineCB: identityLineCB,
      errorCB: raiseErrorCB,
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
      directiveLineCB: createSilenDirectiveHandler(opts),
      normalLineCB: nullLineCB,
      errorCB: printErrorCB,
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
      directiveLineCB: printDirectiveLineCB,
      normalLineCB: nullLineCB,
      errorCB: printErrorCB,
    },
    opts
  );
};

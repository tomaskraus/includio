/**
 * shared functions & types for the Includo app
 */

import Debug from 'debug';
import {join, normalize} from 'node:path';

export const appLog = Debug('includo');

export const VAR_NAME_REGEXP = /[a-zA-z]+[\w\d]*/;
export const PART_NAME_REGEXP = /[_a-zA-z]+[-\w\d]*/;
export const COMMAND_NAME_REGEXP = VAR_NAME_REGEXP;

/**
 * Options for Includo
 */
export type TIncludoOptions = {
  /**
   * A string which represents a tag for insert "file or its part"
   */
  tagInsert: string;
  /**
   * A directory where to look for files for insertion
   */
  resourceDir: string;
};

export const DEFAULT_INCLUDO_OPTIONS: TIncludoOptions = {
  tagInsert: '@@',
  resourceDir: '',
};

export const createFileNameResolver =
  (resourceDir: string) => (fileName: string) =>
    normalize(join(resourceDir, fileName));

const createParseFileName = () => {
  // https://stackoverflow.com/questions/6768779/test-filename-with-regular-expression
  const FILEPATH_REGEXP = /^[^<>;,?"*| ]+$/;
  const FILEPATH_QUOTED_REGEXP = /^"[^<>;,?"*|]+"$/;

  return (line: string): string => {
    const sanitizedLine = line.trim();
    if (FILEPATH_REGEXP.test(sanitizedLine)) {
      return sanitizedLine;
    }
    if (FILEPATH_QUOTED_REGEXP.test(sanitizedLine)) {
      //remove quotes
      return sanitizedLine.slice(1, -1);
    }
    throw new Error(`Invalid file name format: (${line})`);
  };
};

export const parseFileName = createParseFileName();

export const getFileLineInfoStr = (fileName: string, lineNumber: number) =>
  `${fileName}:${lineNumber}`;

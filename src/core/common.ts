/**
 * shared functions & types for the Includio app
 */

import Debug from 'debug';
import {join, normalize} from 'node:path';

export const appLog = Debug('includio');

export const VAR_NAME_REGEXP = /[a-zA-z]+[\w\d]*/;
export const PART_NAME_REGEXP = /[_a-zA-z]+[-\w\d]*/;
export const COMMAND_NAME_REGEXP = VAR_NAME_REGEXP;

/**
 * Options for Includio
 */
export type TIncludioOptions = {
  /**
   * A string which represents a tag for insert "file or its part"
   */
  tagInsert: string;
  /**
   * A directory where to look for files for insertion
   */
  resourceDir: string;

  /**
   * Comment pair map. Start comment, end comment.
   * Most comments, such as JS line comments, don't have end part. Some others do, such as html comment.
   */
  commentPairMap: Array<[string, string, string]>; // key, startComment, endComment

  /**
   * default start comment string, end comment string
   */
  defaultCommentPair: [string, string];
};

export const DEFAULT_INCLUDIO_OPTIONS: TIncludioOptions = {
  tagInsert: '@@',
  resourceDir: '.',
  commentPairMap: [
    ['js', '//', ''],
    ['ts', '//', ''],
    ['jsx', '//', ''],
    ['tsx', '//', ''],
    ['java', '//', ''],
    ['c', '//', ''],
    ['cpp', '//', ''],
    ['h', '//', ''],
    ['ino', '//', ''],
    ['cs', '//', ''],
    ['kf', '//', ''], // Kotlin
    ['swift', '//', ''],
    ['go', '//', ''],
    ['html', '<!--', '-->'],
    ['md', '<!---', '--->'],
    ['css', '/*', '*/'],
    ['php', '//', ''],
    ['py', '#', ''],
    ['sh', '#', ''],
    ['sql', '--', ''],
    ['ini', ';', ''],
    ['bat', 'REM', ''],
    ['vb', "'", ''],
  ],
  defaultCommentPair: ['//', ''],
};

export const mergeIncludioOptions = (
  opts?: Partial<TIncludioOptions>
): TIncludioOptions => ({...DEFAULT_INCLUDIO_OPTIONS, ...opts});

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

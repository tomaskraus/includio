import Debug from 'debug';
import {join, normalize} from 'node:path';

export const appLog = Debug('includo');

export const MARK_NAME_REGEXP = /[a-zA-z]+[\w\d-]*/;

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
  baseDir: string;
};

export const DEFAULT_INCLUDO_OPTIONS: TIncludoOptions = {
  tagInsert: '@@',
  baseDir: '',
};

export const createFileNameResolver = (baseDir: string) => (fileName: string) =>
  normalize(join(baseDir, fileName));

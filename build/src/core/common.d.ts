/**
 * shared functions & types for the Includo app
 */
import Debug from 'debug';
export declare const appLog: Debug.Debugger;
export declare const MARK_NAME_REGEXP: RegExp;
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
    sourceDir: string;
};
export declare const DEFAULT_INCLUDO_OPTIONS: TIncludoOptions;
export declare const createFileNameResolver: (sourceDir: string) => (fileName: string) => string;

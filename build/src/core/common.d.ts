import Debug from 'debug';
export declare const logger: Debug.Debug & {
    debug: Debug.Debug;
    default: Debug.Debug;
};
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
    baseDir: string;
};
export declare const DEFAULT_INCLUDO_OPTIONS: TIncludoOptions;
export declare const createFileNameResolver: (baseDir: string) => (fileName: string) => string;

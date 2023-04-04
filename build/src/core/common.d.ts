/**
 * shared functions & types for the Includio app
 */
import Debug from 'debug';
export declare const appLog: Debug.Debugger;
export declare const VAR_NAME_REGEXP: RegExp;
export declare const PART_NAME_REGEXP: RegExp;
export declare const COMMAND_NAME_REGEXP: RegExp;
/**
 * Options for Includio
 */
export type TIncludioOptions = {
    /**
     * A string which represents a tag for insert "file or its part"
     */
    directiveTag: string;
    /**
     * A directory where to look for files for insertion
     */
    resourceDir: string;
    /**
     * Serves to indicate the part mark line in the resource file.
     * Comment pair map. Start comment, end comment.
     * Should be introduced by a comment valid for that resource file type, to not interfere with the resource file content.
     * Most comments, such as JS line comments, don't have end part. Some others do, such as html comment.
     */
    commentPairMap: Array<[string, string, string]>;
    /**
     * default start comment string, end comment string
     */
    defaultCommentPair: [string, string];
};
export declare const DEFAULT_INCLUDIO_OPTIONS: TIncludioOptions;
export declare const mergeIncludioOptions: (opts?: Partial<TIncludioOptions>) => TIncludioOptions;
export declare const createFileNameResolver: (resourceDir: string) => (fileName: string) => string;
export declare const parseFileName: (line: string) => string;
export declare const getFileLineInfoStr: (fileName: string, lineNumber: number) => string;
export declare const getIndentStr: (s: string) => string;

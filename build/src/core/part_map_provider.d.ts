/**
 * partMapProvider
 *
 * for a file, extract its parts to a map
 */
export declare const createPartMapProvider: (fileContentProvider: (filename: string) => Promise<string[]>, startCommentTagGetter: (filename: string) => string, endCommentTagGetter: (filename: string) => string, partNameRegexp: RegExp) => (value: string) => Promise<Map<string, string[]>>;

/**
 * partMapProvider
 *
 * for a file, extract its parts contents to a map
 */
export declare const createPartMapProvider: (fileContentProvider: (filename: string) => Promise<string[]>, commentTagProvider: (filename: string) => string, partNameRegexp: RegExp) => (value: string) => Promise<Map<string, string[]>>;

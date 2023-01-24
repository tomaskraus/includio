/**
 * MarkMapProvider
 *
 * for a file, extract its marks contents to a map
 */
export declare const createMarkMapProvider: (fileContentProvider: (filename: string) => Promise<string>, markTagProvider: (filename: string) => [string, string], markNameRegexp: RegExp) => (value: string) => Promise<Map<string, string>>;

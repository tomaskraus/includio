export declare const createMarkMapProvider: (fileContentProvider: (filename: string) => Promise<string>, markTagProvider: (filename: string) => [string, string]) => (value: string) => Promise<Map<string, string>>;

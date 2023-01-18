export declare const createMarkContentProvider: (fileContentProvider: (filename: string) => Promise<string>) => (fileName: string, markName: string) => Promise<string>;

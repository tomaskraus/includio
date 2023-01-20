export declare const createMarkContentProvider: (markMapProvider: (marksFileName: string) => Promise<Map<string, string>>) => (fileName: string, markName: string) => Promise<string>;

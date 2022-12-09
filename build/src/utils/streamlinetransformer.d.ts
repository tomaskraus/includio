import stream from 'stream';
export type TLineStats = {
    linesRead: number;
};
export declare const streamLineTransformer: (asyncLineMapFn: (line: string) => Promise<string>) => (input: stream.Readable, output: stream.Writable) => Promise<TLineStats>;

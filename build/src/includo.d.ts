/// <reference types="node" />
import stream from 'stream';
export type TIncludoOptions = {
    encoding: BufferEncoding;
};
export declare const DEFAULT_INCLUDO_OPTIONS: TIncludoOptions;
export declare const processRead: (input: stream.Readable, output: stream.Writable, options?: TIncludoOptions) => Promise<string>;
export declare const processRead2: (input: stream.Readable, output: stream.Writable, options?: TIncludoOptions) => Promise<string>;

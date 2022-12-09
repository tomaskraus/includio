/**
 * adds file capability to stream processor
 */
/// <reference types="node" />
import stream from 'stream';
export type TStreamProcessor<TOptions, TResult> = (input: stream.Readable, output: stream.Writable, options?: TOptions) => Promise<TResult>;
export type TFileProcessor<TOptions, TResult> = (inputFileNameOrStream: stream.Readable | string, outputFileNameOrStream: stream.Writable | string, options?: TOptions) => Promise<TResult>;
export declare const fileStreamWrapper: <TOptions, TResult>(proc: TStreamProcessor<TOptions, TResult>) => TFileProcessor<TOptions, TResult>;

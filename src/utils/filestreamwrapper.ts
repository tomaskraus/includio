/**
 * adds file capability to stream processor
 */

import stream from 'stream';
import * as fsp from 'node:fs/promises';

export type TStreamProcessor<TOptions, TResult> = (
  input: stream.Readable,
  output: stream.Writable,
  options?: TOptions
) => Promise<TResult>;

export type TFileProcessor<TOptions, TResult> = (
  inputFileNameOrStream: stream.Readable | string,
  outputFileNameOrStream: stream.Writable | string,
  options?: TOptions
) => Promise<TResult>;

export const fileStreamWrapper = <TOptions, TResult>(
  proc: TStreamProcessor<TOptions, TResult>
): TFileProcessor<TOptions, TResult> => {
  return (
    inputFileNameOrStream: stream.Readable | string,
    outputFileNameOrStream: stream.Writable | string,
    options?: TOptions
  ) => {
    return new Promise<TResult>((resolve, reject) => {
      const continueWithInStreamReady = (
        inStream: stream.Readable,
        outStream: stream.Writable
      ) => {
        inStream.on('error', err => reject(err));
        proc(inStream, outStream, options)
          .then((res: TResult) => {
            outStream.end();
            resolve(res);
          })
          .catch(err => reject(err));
      };

      const continueWithOutStreamReady = (outStream: stream.Writable): void => {
        outStream.on('error', err => reject(err));
        if (typeof inputFileNameOrStream === 'string') {
          fsp
            .open(inputFileNameOrStream)
            .then(fhi =>
              continueWithInStreamReady(fhi.createReadStream(), outStream)
            )
            .catch(err => reject(err));
        } else {
          continueWithInStreamReady(inputFileNameOrStream, outStream);
        }
      };

      if (typeof outputFileNameOrStream === 'string') {
        fsp
          .open(outputFileNameOrStream, 'w')
          .then(fho => continueWithOutStreamReady(fho.createWriteStream()))
          .catch(err => reject(err));
      } else {
        continueWithOutStreamReady(outputFileNameOrStream);
      }
    });
  };
};

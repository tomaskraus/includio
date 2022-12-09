import stream from 'stream';
import * as readline from 'node:readline';

export type TIncludoOptions = {
  encoding: BufferEncoding;
};

export const DEFAULT_INCLUDO_OPTIONS: TIncludoOptions = {
  encoding: 'utf8',
};

const writerCallback = (err: Error | null | undefined) => {
  if (err) {
    console.error(err);
  }
};

export const processRead = (
  input: stream.Readable,
  output: stream.Writable,
  options?: TIncludoOptions
): Promise<string> => {
  // if (!options) {
  //   DEFAULT_INCLUDO_OPTIONS
  // }

  // from: https://nodejs.org/api/stream.html#class-streamwritable
  function safeWrite(
    data: string,
    callback: (err: Error | null | undefined) => void
  ) {
    if (!output.write(data)) {
      output.once('drain', callback);
    } else {
      process.nextTick(callback);
    }
  }

  return new Promise((resolve, reject) => {
    try {
      const rl = readline.createInterface({input});

      rl.on('line', (s: string) => safeWrite(`- ${s}\n`, writerCallback));
      rl.on('close', () => resolve('read ok'));
    } catch (e) {
      reject(e);
    }
  });
};

export const processRead2 = (
  input: stream.Readable,
  output: stream.Writable,
  options?: TIncludoOptions
): Promise<string> => {
  const trs = new stream.Transform({
    transform(chunk, encoding, callback) {
      callback(null, `* ${chunk}\n`);
    },
  });

  return new Promise((resolve, reject) => {
    input
      .pipe(trs)
      .pipe(output)
      .on('error', err => reject(err))
      .on('end', () => {
        output.end();
        resolve('ok2');
      });
  });
};

import stream from 'stream';
import ReadlineTransform from 'readline-transform';
import {once} from 'events';

export type TLineStats = {
  linesRead: number;
};

export const streamLineTransformer =
  (asyncLineMapFn: (line: string) => Promise<string>) =>
  async (
    input: stream.Readable,
    output: stream.Writable
  ): Promise<TLineStats> => {
    const transformToLines = new ReadlineTransform();
    const r = input.pipe(transformToLines);
    let linesRead = 0;
    for await (const line of r) {
      linesRead++;
      const lineResult = await asyncLineMapFn(line);
      const canContinue = output.write(lineResult);
      // from https://www.nodejsdesignpatterns.com/blog/javascript-async-iterators/
      if (!canContinue) {
        // backpressure, now we stop and we need to wait for drain
        await once(output, 'drain');
        // ok now it's safe to resume writing
      }
    }
    return {linesRead};
  };

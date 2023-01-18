import { TIncludoOptions } from './common';
export type TMarkTag = [string, string];
export declare const createMarkTagProvider: (options: TIncludoOptions) => (fileName: string) => TMarkTag;

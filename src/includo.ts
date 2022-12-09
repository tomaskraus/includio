export type TIncludoOptions = {
  tag_insert: string;
};

export const DEFAULT_INCLUDO_OPTIONS: TIncludoOptions = {
  tag_insert: '@@',
};

const createLineProcessor = (options: TIncludoOptions) => {
  return async (line: string): Promise<string> => {
    return `*** ${line}\n`;
  };
};

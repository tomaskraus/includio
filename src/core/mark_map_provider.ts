import {logger} from './common';

const log = logger('includo:markMapProvider');

export const createMarkMapProvider = (
  fileContentProvider: (filename: string) => Promise<string>,
  markTagProvider: (filename: string) => [string, string]
) => {
  log('CREATE markMapProvider');

  return async (fileName: string): Promise<Map<string, string>> => {
    log(`creating mark map from [${fileName}]`);
    const fileContent = await fileContentProvider(fileName);
    const [beginMarkTag, endMarkTag] = markTagProvider(fileName);
    return Promise.resolve(
      new Map<string, string>()
        .set('mark1', ' m1 line1 \nm1 line2')
        .set('txt', 'HUHUHU!')
        .set('import', 'HU!')
        .set(
          'code',
          "import {logger} from './common';" +
            '\n' +
            "\nconst log = logger('includo:markMapProvider');" +
            '\n' +
            '\nexport const createMarkMapProvider = (' +
            '\n  fileContentProvider: (filename: string) => Promise<string>,' +
            '\n  markTagProvider: (filename: string) => [string, string]' +
            '\n) => {' +
            "\n  log('CREATE markMapProvider');" +
            '\n' +
            '\n  return async (fileName: string): Promise<Map<string, string>> => {' +
            '\n    log(`creating mark map from [${fileName}]`);' +
            '\n    const fileContent = await fileContentProvider(fileName);' +
            '\n    const [beginMarkTag, endMarkTag] = markTagProvider(fileName);' +
            '\n    return Promise.resolve(' +
            '\n      new Map<string, string>()' +
            "\n        .set('mark1', ' m1 line1 \\nm1 line2')" +
            "\n        .set('txt', 'HUHUHU!')" +
            "\n        .set('import', 'HU!')" +
            "\n        .set('code', '')" +
            '\n    );' +
            '\n  };' +
            '\n};' +
            '\n'
        )
    );
  };
};

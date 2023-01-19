# includo

A simple file(part) includer tool.

### CLI usage:

```sh
Usage: node_modules/.bin/preprocess -f <source> -d <destination> [--option
<argument>]...

Options:
  -h, --help      Show help                                            [boolean]
  -f, --srcFile   The source file to be processed            [string] [required]
  -d, --destFile  The file to be output after processing     [string] [required]
  -c, --context   Context JSON object that includes variables found in the
                  source                                                [string]
  -t, --type      Type of file to process             [string] [default: "html"]
  -v, --version   Show version number                                  [boolean]

Missing required arguments: f, d
[31mPlease provide both source (-f) and destination (-d) arguments to run this tool[39m

```

### How it works:

1. create a template. That can contain lines beginning with `@@`. These lines will be replaced by `Includo`, according the instructions on that line.

For example, a template file for the content you are reading now, looks like:

```
//@@ README.md.template //do not include it, as its triple \`\`\` marks can do mess in the final markdown
```

That line which contains the `@@ help.txt`, tells `Includo` to insert the `help.txt` file. Which looks like:

```
Usage: node_modules/.bin/preprocess -f <source> -d <destination> [--option
<argument>]...

Options:
  -h, --help      Show help                                            [boolean]
  -f, --srcFile   The source file to be processed            [string] [required]
  -d, --destFile  The file to be output after processing     [string] [required]
  -c, --context   Context JSON object that includes variables found in the
                  source                                                [string]
  -t, --type      Type of file to process             [string] [default: "html"]
  -v, --version   Show version number                                  [boolean]

Missing required arguments: f, d
[31mPlease provide both source (-f) and destination (-d) arguments to run this tool[39m

```

## API

HUHUHU!

```ts
HU!

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
        .set('code', '')
    );
  };
};

```

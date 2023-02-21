<!--- Comments are Fun --->

# includo

A simple file insertion preprocessor for text-based files. Inserts files (or their parts) to the resulting file.  
It is great for keeping your documentation up-to-date.

## General Usage

1. Make a template from your documentation - by adding `@@ ` lines with (at least) a file name you want to include to it.
2. Run `Includo` command line app over it.
3. Check the result.

## Example 1

You want to have the help page of your command line app to be included in the markdown documentation, but you are tired of manually copy-paste updated help output whenever the app controls changes:

## Goals

- **Simple** & easy to use  
  the less features the better
- **Do one thing**: include files  
  there are full-blown preprocessors already
- Extensive **error checks**  
  to prevent missing or wrong parts in auto-generated documentation
- **CI** friendly  
  works well within a **pipeline**
- Language **agnostic**  
  not only for js & markdown

## Installation

TBD...

## First Example

![Includo schema simple](./my%20assets/includo-simple.png)

A more detailed view:

![Includo schema](./my%20assets/includo.png)

### CLI usage:

```sh
Usage: includo [options]

Inserts files (or their parts) into a text file.

Options:
  -V, --version              output the version number
  -i --inputFile <string>    File other files will be inserted into.
                             If not specified, standard input will be used.
  -o --outputFile <string>   File where to output the result.
                             If not specified, standard output will be used.
  -r --resourceDir <string>  Directory where to include files from.
                             If not specified, current working dir (.) will be
                             used.
  -t --test                  Check the input file & resources for possible
                             errors.
  -h, --help                 display help for command

  Example: 
  includo -i README.template.md -o README.md -r assets

```

### How it works:

1. create a template. That can contain lines beginning with `@@`. These lines will be replaced by `Includo`, according the instructions on that line.

For example, a template file for the content you are reading now, looks like:

```
//@@ README.md.template //do not include it, as its triple \`\`\` marks can do mess in the final markdown
```

That line which contains the `@@ help.txt`, tells `Includo` to insert the `help.txt` file. Which looks like:

```
Usage: includo [options]

Inserts files (or their parts) into a text file.
```

## API

    Create includo engine this way:

```ts
import {createIncludoProcessor} from 'includo';

import {stdin, stdout} from 'node:process';

createIncludoProcessor()(stdin, stdout)
  .then(result => {
    console.log(`lines read: ${result.lineNumber}`);
  })
  .catch(err => console.error(err));
```

### API usage

```ts
import {createIncludoProcessor} from 'includo';
```

function header:

```ts
createIncludoProcessor()(stdin, stdout)
```

a bit of code:

```ts
import {stdin, stdout} from 'node:process';

createIncludoProcessor()(stdin, stdout)
  .then(result => {
    console.log(`lines read: ${result.lineNumber}`);
  })
//...
```

### Python

```py
def direction_name(direction):
    """
    >>> direction_name(2)
    '>'
    """
    names = ['', '^', '>', 'v', '<']
    check_direction(direction)
    return names[direction]
```

<!--- Comments are Fun --->

# includo

A simple file insertion preprocessor for text-based files. Inserts files (or their parts) to the resulting file.  
It is great for keeping your documentation up-to-date.

## General Usage

1. Make a template from your documentation - by adding `@@ ` lines with (at least) a file name you want to include to it.
2. Run `Includo` command line app over it.
3. Check the result.  
   In general, those lines starting with `@@ ` will be replaced by the file content (or its part).

## Example

We want the content of the file `middle.txt` to be included in a resulting file `rhymes.txt`:

`middle.txt`:

```
Over the hill and far away.
Mother duck said, “Quack, quack, quack, quack.”
```

Make a template `rhymes.template.txt`, which contains inclusion instruction line:

`rhymes.template.txt`:

```
Five little ducks went out one day.
@@ middle.txt
But only four little ducks came back.
```

Process the template with `includo` app to generate the `rhymes.txt` result:

```sh
npx includo -i rhymes.template.txt -o rhymes.txt
```

result (`rhymes.txt`):

```
Five little ducks went out one day.
Over the hill and far away.
Mother duck said, “Quack, quack, quack, quack.”
But only four little ducks came back.
```

The source of this example can be found at [examples/example_1/](examples/example_1/)

## Features

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

#

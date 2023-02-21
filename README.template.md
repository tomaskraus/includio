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

`middle.txt`:

```
@@ examples/example_1/middle.txt
```

`rhymes.template.txt`:

```
@@ examples/example_1/rhymes.template.txt
```

run this to generate the result:

```sh
@@ examples/example_1/run.sh : Generate
```

result (`rhymes.txt`):

```
@@ examples/example_1/rhymes.txt
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

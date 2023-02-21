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

1. `middle.txt` content:

```
@@ examples/example_1/middle.txt
```

2. Make a template `rhymes.template.txt`, which contains inclusion instruction line.

`rhymes.template.txt`:

```
@@ examples/example_1/rhymes.template.txt
```

3. Process the template with `includo` app to generate the `rhymes.txt` result:

```sh
@@ examples/example_1/run.sh : Generate
```

4. Result (`rhymes.txt`):

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

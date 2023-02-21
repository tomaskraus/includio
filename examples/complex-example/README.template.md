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
@@ help.txt
```

### How it works:

1. create a template. That can contain lines beginning with `@@`. These lines will be replaced by `Includo`, according the instructions on that line.

For example, a template file for the content you are reading now, looks like:

```
//@@ README.md.template //do not include it, as its triple \`\`\` marks can do mess in the final markdown
```

That line which contains the `@@ help.txt`, tells `Includo` to insert the `help.txt` file. Which looks like:

```
@@ help.txt | first 3
```

## API

@@ snippets.ts : txt

```ts
@@ shared.ts : import_includo

@@ snippets.ts : code
```

### API usage

```ts
@@ shared.ts : import_includo
```

function header:

```ts
@@ snippets.ts | first 12 | last 1
```

a bit of code:

```ts
@@ snippets.ts : code | first 6, //...
```

### Python

```py
@@ maze.py : example1
```

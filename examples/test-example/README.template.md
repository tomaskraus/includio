# includo

A simple file(part) includer tool.

### CLI usage:

```sh
@@ help1.txt
```

### How it works:

1. create a template. That can contain lines beginning with `@@`. These lines will be replaced by `Includo`, according the instructions on that line.

For example, a template file for the content you are reading now, looks like:

```
//@@ README.md.template //do not include it, as its triple \`\`\` marks can do mess in the final markdown
```

That line which contains the `@@ help.txt`, tells `Includo` to insert the `help.txt` file. Which looks like:

```
@@ help.txt | first -1

@@ help.txt | first abc
```

## API

@@ snippets.ts : txt

```ts
@@ shared.ts : import_2includo

@@ shared.ts : | first 100


@@ snippets.ts : cod+e


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
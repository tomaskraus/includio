<!--- Comments are Fun --->

# includio

A simple yet thoughtful file insertion preprocessor for text-based files. Inserts files (or their parts) to the resulting file.  
It is great for keeping your documentation up to date.

- **Simple** & does **one** thing:  
  the file inclusion stuff. The less features the better.  
   If you want more, there are full-blown preprocessors already, such as [preprocess](https://www.npmjs.com/package/preprocess).
- Extensive **error checks**,  
   to help find missing or invalid parts in auto-generated documentation easily.
- **CI** friendly.  
  Stdin/stdout. Works well within a **pipeline**.
- Language **agnostic**  
  Not only for js & markdown.

## Installation

```bash
$ npm install includio
```

or (to install **includio** globally):

```bash
$ npm install -g includio
```

## Example 1: include whole file

1. To include a file (let's say `assets/hello.js`) into the another file (for example: `README.template.md`), just insert a line with the `@@` directive mark at the appropriate place in the `README.template.md`, followed by the name (path) of the file you want to be included (in this case `assets/hello.js`):

   ```md
   @@ examples/example_first/README.template.md
   ```

2. Run **includio** command line app over the `README.template.md` to (re)generate the `README.md` file.

   ```
   @@ examples/example_first/run.sh : Generate
   ```

3. Result (`README.md`):

   ```md
   @@ examples/example_first/README.md
   ```

You see, that in the resulting `README.md` file:

1. The directive line from the `README.template.md` was replaced by the content of `assets/hello.ts` file.
2. The content of the `assets/hello.ts` file inserted has the same left-spacing as the directive line in `README.template.md`.

## Example 2: partial insertion

We want the `inc` method from `my-lib.js` **resource** file to be included in `api.md`:

api.md:

```md
@@ examples/example_partial/api.orig.md
```

my-lib.js:

```js
@@ examples/example_partial/my-lib.orig.js
```

1. First, we shoud do a little edit of `my-lib.js`: add some named **mark** pair, surrounding the `inc` method code. Let's name the starting **mark** "inc".  
   The "inc" **part** will contain everything between those two **marks**:

   my-lib.js (after edit):

   ```js
   @@ examples/example_partial/my-lib.js
   ```

   There are two **marks**: the named one: `//< inc` and an anonymous: `//<`. Both marks starts as a javascript comment, to not interfere with the rest of the code.  
    These two **marks** form a **part**, with a name "inc".

2. Create a file `api.template.md` from `api.md`, and add a **directive** which points to the "inc" **part** of the `my-lib.js` **resource** file:

   api.template.md:

   <!-- prettier-ignore -->
   ~~~md
    @@ examples/example_partial/api.template.md
    ~~~

3. Process the template with **includio** app to generate the `api.md` result:

   ```sh
   @@ examples/example_partial/run.sh : Generate
   ```

4. Result (`api.md`):

   <!-- prettier-ignore -->
   ````md
    @@ examples/example_partial/api.md
    ````

### Notes

- There can be multiple named or anonymous **marks** in a **resource** file.
- There is no concept of nested, or opening/closing **marks**. Every **mark**, either named or anonymous, defines a section of the **resource** file:

  ```
    line 1
  //< section-1
    line 3
    line 4
  //< section-2
    line 6
  //<
    line 8
  //< another-part
    line 10
  //<
  ```

  1. Named part `section-1` contains lines "line 3" and "line 4"
  2. Named part `section-2` contains line "line 6"
  3. Named part `another-part` contains line "line 10"

## Commands

The **command** is an optional part of a directive, that further manipulates the content to be inserted. The command is separated by a "|" (pipe) character from the **selector**. The command can have parameters, separated by a comma (,).

@@ examples/directive-examples.md : one-command

### Command Chain

In one directive, multiple commands can be chained via the pipe operator (|). In that pipeline, the current command will send its result to the next one.

@@ examples/directive-examples.md : command-pipeline

## Command List

### First

@@ src/core/commands.ts : first  
@@ examples/example_commands/examples.md : first  
@@ examples/example_commands/results.md : first

### Last

@@ src/core/commands.ts : last  
@@ examples/example_commands/examples.md : last  
@@ examples/example_commands/results.md : last

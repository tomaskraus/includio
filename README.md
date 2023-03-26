<!--- Comments are Fun --->

# includio

a simple yet thoughtful file insertion preprocessor for text-based files. Inserts files (or their parts) to the resulting file.  
It is great for keeping your documentation up to date.

## Installation

```bash
$ npm install includio
```

or

```bash
$ npm install -g includio
```

to install `includio` globally

## General Usage

1. Make a template from your documentation: simply save your `README.md` file as `README.template.md` and add some **directives**.  
   Directives are lines which start with `@@ ` directive mark and contains (at least) a file name you want to be included in the result.

   README.template.md:

   ```
   The first example:
   @@ assets/hello.js
   
   ```

2. Run `includio` command line app over it.

   ```
   npx includio --i README.template.md > README.md
   ```

3. Check the result.

   README.md:

   ```
   The first example:
   console.log('Hello World!');
   
   
   ```

   In general, those **directives** will be replaced by the file content (or its part).

## Features

- **Simple** & easy to use  
  The less features the better.
- **Do one thing**: include files only.  
  If you want more, there are full-blown preprocessors already, such as [preprocess](https://www.npmjs.com/package/preprocess).
- Extensive **error checks**,  
   to prevent missing or invalid parts in auto-generated documentation.
- **CI** friendly  
  Works well within a **pipeline**.
- Language **agnostic**  
  Not only for js & markdown.

## Quick Start

### Partial Insertion

We want the `inc` method from `my-lib.js` **resource** file to be included in `api.md`:

api.md:

```md
## API

```

my-lib.js:

```js
const add = x => y => x + y;

const inc = x => {
  return add(1)(x);
};

console.log(inc(10)); //=> 11

```

1. first, we shoud do a little edit of `my-lib.js`: add some named **mark** pair, surrounding the `inc` method code. Let's name the starting **mark** "inc".  
   The "inc" **part** will contain everything between those two **marks**:

   my-lib.js (after edit):

   ```js
   const add = x => y => x + y;
   
   //< inc
   const inc = x => {
     return add(1)(x);
   };
   //<
   
   console.log(inc(10)); //=> 11
   
   ```

   There are two **marks**: the named one: `//< inc` and an anonymous: `//<`  
    These two **marks** form a **part**, with a name "inc".

2. Create a file `api.template.md` from `api.md`, and add a **directive** which points to the "inc" **part** of the `my-lib.js` **resource** file:

   api.template.md:

   <!-- prettier-ignore -->
   ~~~md
    # API
    
    ```js
    @@ my-lib.js : inc
    ```
    
    ~~~

3. Process the template with `includio` app to generate the `api.md` result:

   ```sh
   npx includio -i api.template.md -o api.md
   ```

4. Result (`api.md`):

   <!-- prettier-ignore -->
   ````md
    # API
    
    ```js
    const inc = x => {
      return add(1)(x);
    };
    ```
    
    ````

### Selector

Every **directive** starts with a `@@ `, followed by a **selector**. The **selector** consists of a **resource** file name (can contain a path), and an optional **part** name.

Example: There is a **directive** with a **selector**, that returns the **content** of "greet" **part** of an `examples/hello.js` **resource** file.

```
@@ examples/hello.js : greet
```

The **selector** determines the **content** that will be inserted to the **result** output.

### Commands

#### Notes

- There can be multiple named or anonymous **marks** in a **resource** file.
- There is no concept of nested **marks**. Every **mark**, either named or anonymous, defines a section of the **resource** file.

## Command Line Help

```
Usage: includio [options]

Creates the result output by replacing every directive in the input template
with the content of the resourceFile (or its part) mentioned in that directive.

Options:
  -V, --version              output the version number
  -i --inputFile <string>    The input template
                             If not specified, standard input will be used.
  -o --outputFile <string>   A result file.
                             If not specified, the result will be sent to a
                             standard output.
  -r --resourceDir <string>  Directory where to look for resourceFiles.
                             (default: ".")
  -t --test                  Check the input template & its resourcFiles for
                             possible errors.
  -l --list                  Lists all directives in the input.
  -h, --help                 display help for command

  Example: 
  includio -i README.template.md -o README.md -r assets

```

## Includio Processing Manual

### Key Words

- **Includio**  
  Command line, text manipulation application. Takes a **template** and produces a **result**.  
  Reads the **template** line by line and creates the **result** by replacing every **directive** line in the **template** with the **content** of the **resourceFile** mentioned in that **directive**.
- **Content**  
  Lines of text. That's what is inserted to the **result** from **resourceFile**(s), using **directives**.
- **Template**  
  The text file (or standard input) from which **includio** produces the result. The template may (and typically does) contain **directives**, which tells **includio** to insert a **content** of certain **resourceFile**.  
  If there is no **directive** in a **template**, then **includio** app's **result** is just equal to the **template**.
- **Result**  
  A text file (or standard output) **includio** generates from the **template**. Contains a text from **template** and a **content** generated by **directive**(s) found in the **template**.  
  Any manual change of the **result** file will be overwritten on the next **includio** call.
- **ResourceFile**  
  A text file mentioned in the **directive**. The source of **content**.
- **Directive**  
  A special line in the **template** file, starts with `@@ `, followed by a **Selector**, that tells **includio**, what **content** to insert into the **result**. After a **selector**, there are zero or more **commands** which alter the **content** before it is inserted into the **result**.  
  In a **result**, every **directive** is replaced by the **content** it produces.
- **Selector**  
  contains name of **resourceFile**, from which the **content** will be inserted. Can also contain a **part** name, that specifies a certain part of the **content**.
- **Part**  
  Points to the specified, named part of the **resourceFile**, using a **mark** name.  
  **Part** always points to a continuous sequence of lines in the **resourceFile**.
- **Mark**  
  A special line in the **resourceFile**, introducing the beginning of its **part**.  
  Consists of a special character sequence, can contain a name and further comment.  
  All the lines between two **marks** creates a **content** of one **part**.  
  **Mark** can have a name - can be then referenced as a named **part** of its **resourceFile**, from a **directive** in the **template**.  
  Typically **marks** are hidden behind a line comment so they don't interfere with the code in the **resourceFile**.
- **Command**  
  A function in the **directive** that further manipulates with the **content** provided by a **selector**. A **command** can have zero or more parameters.  
  **Commands** can be chained by a pipe operator, each **command** giving its output to the next one.  
  The content of the last **command**'s output is then inserted to the **result**.

### Part & Mark

In general, marks are written as `<`, behind a line comment:

- `//< fun1` is an example of a named mark with a name "fun1", in some Javascript file.
- `#< fun2 some comment` is an example of a named mark with a name "fun2", in a Python file. Only the first word is recognized as a part name!
- `#<` is an example of an anonymous mark in a Python file.

A valid part name is case sensitive and consists of alphabetical characters, digits, "\_" and "-" character. Cannot starts with a digit.  
For example, `the_firstExample-1` is a valid part name.

There is no concept of nested marks, nor begin-end marks. Instead, a mark behaves like a section - in a flat linear manner:

```
  line 1
//< section-1
  line 3
  line 4
//< section-2
  line 6
//<
  line 8
```

There are two named parts:

1. `section-1`, which contains lines "line 3" and "line 4"
2. `section-2`, with the line "line 6"

"line 1" and "line 8" are unreachable by any part selector.

### Directive

- `@@ code.js`  
  is an example of a simple directive, to include a whole `code.js` file content.
- `@@ code.js : example-1`  
  is an example of a simple directive, to include an `example-1` part of the `code.js` file content.
- `@@ code.js | first 3`  
  include the first 3 lines of the `code.js` file content.
- `@@ code.js : example-1 | first 3`  
  include the first 3 lines of `example-1` part of the `code.js` file content.

### Command

### List of commands

#### first

#### last

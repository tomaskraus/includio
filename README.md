<!--- Comments are Fun --->

# includio

A simple yet thoughtful file insertion preprocessor for text-based files. Inserts files (or their parts) to the resulting file.  
It is great for keeping your documentation up to date.

## Installation

```bash
$ npm install includio
```

or

```bash
$ npm install -g includio
```

to install **includio** globally

## Example

1. Resource file (`./assets/hello.js`):

   ```js
   console.log('Hello World!');
   // Hello
   
   ```

2. Template (`README.template.md`):

   ```md
   ## The first example:
   
       ```js
       @@ assets/hello.js
       ```
   
   That was easy ;)
   
   ```

   There is a **directive** line in the template, which starts with `@@` directive mark and contains (at least) a file name you want to be included in the result.

3. Run **includio** command line app over the template to (re)generate the `README.md` file.

   ```
   npx includio -i README.template.md > README.md
   ```

4. Result (`README.md`):

   ```md
   ## The first example:
   
       ```js
       console.log('Hello World!');
       // Hello
       
       ```
   
   That was easy ;)
   
   ```

You see, that in the resulting `README.md` file:

1. The directive from the `README.template.md` was replaced by the content of `assets/hello.ts` file.
2. The content of the `assets/hello.ts` file inserted is aligned in the same way as the directive in `README.template.md`.

## Features

- **Simple** & easy to use.  
  The less features the better.
- **Do one thing**: the file inclusion stuff.  
  If you want more, there are full-blown preprocessors already, such as [preprocess](https://www.npmjs.com/package/preprocess).
- Extensive **error checks**,  
   to prevent missing or invalid parts in auto-generated documentation.
- **CI** friendly.  
  Stdin/stdout. Works well within a **pipeline**.
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

1. First, we shoud do a little edit of `my-lib.js`: add some named **mark** pair, surrounding the `inc` method code. Let's name the starting **mark** "inc".  
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

3. Process the template with **includio** app to generate the `api.md` result:

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

#### Notes

- There can be multiple named or anonymous **marks** in a **resource** file.
- There is no concept of nested **marks**. Every **mark**, either named or anonymous, defines a section of the **resource** file.

### Selector

Every **directive** starts with a `@@`, followed by a **selector**. The **selector** consists of a **resource** file name (can contain a path), and an optional **part** name, separated by a ":" (colon).

**Example:**

This is a **directive** with a **selector**, that returns the **content** of the "greet" **part** of an `examples/hello.js` **resource** file:

```

@@ examples/hello.js : greet

```

The **selector** determines the **content** that will be inserted to the **result** output.

### Commands

The **command** is an optional part of a directive, that further manipulates the content to be inserted. The command is separated by a "|" (pipe) character from the **selector**. The command can have parameters, separated by a comma (,).

**Example:**

This is a **directive** with a **selector**, that returns the **content** of the "greet" **part** of an `examples/hello.js` **resource** file.  
Only the first 2 lines of the "greet" **part** will be inserted:

```

@@ examples/hello.js : greet | first 2

```

#### Command Chain

In one directive, multiple commands can be chained via the pipe operator (|). In that pipeline, the current command will send its result to the next one.

**Example:**

```

@@ examples/hello.js : greet | last 2 | first 1

```

This is a **directive** returns the last but one line of the "greet" **part** of an `examples/hello.js` file.

## Command List

### First

Returns the first _n_ lines of a content.

### Last

Returns the last _n_ lines of a content.

## Details

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

<!--- Comments are Fun --->

# includio

A simple yet thoughtful file insertion preprocessor for text-based files. Inserts files (or their parts) to the resulting file.  
It is great for keeping your documentation up to date.

In fact, template of this document was preprocessed by **includio**, linking all the code examples.

- **Simple** & does **one** thing:  
  the file inclusion stuff. The less features the better.  
   If you want more, there are full-blown preprocessors already, such as [preprocess](https://www.npmjs.com/package/preprocess).
- Extensive **error** checks,  
   to help find missing or invalid parts in the generated result.
- **CI** friendly.  
  Stdin/stdout. Works well within a **pipeline**.
- Language **agnostic**.  
  Not only for js & markdown.

## Installation

```bash
$ npm install includio
```

or (to install **includio** globally):

```bash
$ npm install -g includio
```

## How it works

1. **Includio** command line app processes an iput file (or a standard input) line by line. This input acts as a **template**, which can contain **directives** - lines starting with "@@" and containing name of some **resource** file to be inserted, plus some optional commands.
2. **Includio** then writes all but directive input lines to the output file or the standard output.  
   Includio replaces each of those **directive** lines with the content of the resource file mentioned in that directive.
   The replacement can be further refined by the optional **commands** in the directive line.

**Note:** if there is no **directive** in the whole input, **Includio** just copies the input to the output.

## Example 1: include whole file

1. Having this resource file (`assets/refrain.txt`):

   ```
   Ho ho,
   Ho ho ho...
   ```

2. ...and a template (`santa.template.txt`):

   ```
   The First Example:
   
   Santa is coming,
     @@ assets/refrain.txt
    Santa is almost here!
      @@ assets/refrain.txt
   ```

3. Run **includio** command line app over the `santa.template.txt` to (re)generate the `santa.txt` file:

   ```
   npx includio -i santa.template.txt -o santa.txt
   ```

4. Result (`santa.txt`):

   ```
   The First Example:
   
   Santa is coming,
     Ho ho,
     Ho ho ho...
    Santa is almost here!
      Ho ho,
      Ho ho ho...
   ```

**Note:** in the resulting `santa.txt` file, the content of the `assets/refrain.txt` inserted file is aligned the same way as those `@@` directive lines in the `santa.template.txt`.

## Example 2: partial insertion

We want the `inc` method from `my-lib.js` **resource** file to be included in `api.md` file:

1. `api.template.md` and `my-lib.js`:

   api.template.md
   <!-- prettier-ignore -->
   ~~~md
    # API
    
    ```js
    @@ my-lib.js : inc
    ```
    
    ~~~

   my-lib.js

   ```js
   const add = x => y => x + y;
   
   //< inc
   const inc = x => {
     return add(1)(x);
   };
   //<
   
   console.log(inc(10)); //=> 11
   
   ```

   There are two **marks** in `my-lib.js` file: the named one: `//< inc` and an anonymous: `//<`.  
   Both marks starts as a javascript comment, to not interfere with the rest of the code.  
    These two **marks** form a **part**, with a name "inc". That named part we're referencing in the `api.template.md`.

2. Process the template with **includio** app to generate the `api.md` result:

   ```sh
   npx includio -i api.template.md -o api.md
   ```

3. Result (`api.md`):

   <!-- prettier-ignore -->
   ````md
    # API
    
    ```js
    const inc = x => {
      return add(1)(x);
    };
    ```
    
    ````

### Notes

- There can be multiple named or anonymous **marks** in the **resource** file.
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

## Custom Resource Directory

You can set a common path for all the inclusion files found in your input template. Example:

```
npx includio -r resources/develop -i template.md
```

For every directive in `template.md`, includio will prefix directive's file name with "./resources/develop/"

If no resource path is specified, the current working directory will be used as a default.

## List Directives in the Template

## Test Mode

## Working with I/O

### Pseudo Interactive Mode

### Non-recursive Directive Replacement

### Pipelining Includio

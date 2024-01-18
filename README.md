<!--- Comments are Fun --->

# includio

A simple yet thoughtful file insertion preprocessor for text-based files. Inserts files (or their parts) to the resulting file.  

## Example

1. `template.txt`:

   ```
   Santa is coming,
     @@ resource.txt
    Santa is almost here!
       @@ resource.txt
   
   ```

2. `resource.txt`:

   ```
   Ho ho,
   Ho ho ho...
   ```

3. Process:

   ```
   npx includio -i template.txt -o result.txt
   ```

4. The final output - `result.txt`:

   ```
   Santa is coming,
     Ho ho,
     Ho ho ho...
    Santa is almost here!
       Ho ho,
       Ho ho ho...
   
   ```

> **NOTE:** there are **directives** in the `template.txt` file: lines beginning with "@@" and containing name of some resource file to be inserted.

> **NOTE:** in the resulting `result.txt` file, the content of the `resource.txt` inserted file is aligned the same way as those `@@` directive lines in the `template.txt`.


## Example 2: insert a part of the file

We want to insert the `inc` function code snippet from the `my-lib.js` source file to the `api.md` documentation file:

1. `api.template.md`:

   <!-- prettier-ignore -->
   ~~~md
    # API
    
    ```js
    @@ my-lib.js : inc-fn
    ```
    
    ~~~

2. `my-lib.js`:

   ```js
   const add = x => y => x + y;
   
   //< inc-fn
   const inc = x => {
     return add(1)(x);
   };
   //<
   
   console.log(inc(10)); //=> 11
   
   ```

   See? Our `inc` function is enclosed between `//< inc-fn` and `//<` marks, indicating a block named `inc-fn`. That named block we're referencing in the `api.template.md`.
   > **NOTE**: Both marks are javascript comments, to not interfere with the rest of the code.  
   

2. Generate the `api.md` result:

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



## Includio Goals:

- **Simple** & does **one** thing:  
  the file inclusion stuff. The less features the better.  
   If you want more, there are full-blown preprocessors already, such as [preprocess](https://www.npmjs.com/package/preprocess).
- Extensive **error** checks,  
   to help find missing or invalid parts in the generated result.
- **CI** friendly.  
  Stdin/stdout. Works well within a **pipeline**.
- Language **agnostic**.  
  Not only for **js** & **markdown**.

## Installation

```bash
$ npm install includio
```

or (to install **includio** globally):

```bash
$ npm install -g includio
```

## How Includio works

1. **Includio** command line app processes an input file (or a standard input) line by line. This input acts as a **template**, which can contain **directives** - lines starting with "@@" and containing name of some **resource file** to be inserted, plus some optional commands.
2. **Includio** then writes all but directive input lines to the output file or the standard output.  
   Includio replaces each of those **directive** lines with the content of the resource file mentioned in that directive.  
   The replacement can be further refined by the optional _block name_ in the directive line. In that case, only the content of a block of that name is inserted from the resource file.

> **NOTE:** if there is no **directive** in the whole input, **Includio** just copies the input to the output.


There can be multiple named or anonymous **blocks** in each of the **resource** files.

There is no concept of nested blocks. Blocks act as sections, separated by its marks.  
Consider this resource file:

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

  1. Named block `section-1` contains lines "line 3" and "line 4"
  2. Named block `section-2` contains line "line 6"
  3. Named block `another-part` contains line "line 10"
  4. There are also two anonymous blocks: 
    - the first at the very beginning, containing "line 1"
    - the one containing "line 8"

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

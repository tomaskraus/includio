<!--< selector -->

**Example:**

This is a **directive** with a **selector**, that returns the **content** of the "greet" **part** of an `examples/hello.js` **resource** file:

```
@@ examples/hello.js : greet
```

<!--< one-command -->

**Example:**

This is a **directive** with a **selector**, that returns the **content** of the "greet" **part** of an `examples/hello.js` **resource** file.  
Only the first 2 lines of the "greet" **part** will be inserted:

```
@@ examples/hello.js : greet | first 2
```

<!--< command-pipeline -->

**Example:**

This is a **directive** that returns the 3rd line of the "greet" **part** of an `examples/hello.js` file:

```
@@ examples/hello.js : greet | first 3 | last 1
```

<!--< -->

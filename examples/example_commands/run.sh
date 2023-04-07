#!/bin/bash

node ../../bin/cli -r ../../src/core -i examples.template.md -o examples.md
node ../../bin/cli -r ../../src/core -i results.template.md | node ../../bin/cli -o results.md

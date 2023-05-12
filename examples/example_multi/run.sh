#!/bin/bash

# node ../../bin/cli -i template.txt  \
# | node ../../bin/cli                \
# | node ../../bin/cli                \
# | node ../../bin/cli                \
# | node ../../bin/cli -r terminal    \
#  -o result.txt

npx includio -i template.txt  \
| npx includio                \
| npx includio                \
| npx includio                \
| npx includio -r terminal    \
 -o result.txt
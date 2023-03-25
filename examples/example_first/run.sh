#!/bin/bash

node ../../bin/cli -i README.template.md > README.md

if (( 0 )) ; then
#< Generate a documentation with the updated information:
npx includio --i README.template.md > README.md
#<
fi
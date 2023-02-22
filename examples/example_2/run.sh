#!/bin/bash

node ../../bin/cli -i api.template.md -o api.md

if (( 0 )) ; then
#< Generate a documentation with the updated information:
npx includo -i api.template.md -o api.md
#<
fi
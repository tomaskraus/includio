#!/bin/bash

node ../../bin/cli -i template.txt -o result.txt

if (( 0 )) ; then
#< Generate a documentation with the updated information:
npx includio -i template.txt -o result.txt
#<
fi

#!/bin/bash

node ../../bin/cli -i rhymes.template.txt -o rhymes.txt

if (( 0 )) ; then
#< Generate a documentation with the updated information:
npx includo -i rhymes.template.txt -o rhymes.txt
#<
fi
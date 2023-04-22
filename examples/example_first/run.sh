#!/bin/bash

node ../../bin/cli -i santa.template.txt -o santa.txt

if (( 0 )) ; then
#< Generate a documentation with the updated information:
npx includio -i santa.template.txt -o santa.txt
#<
fi
#!/bin/bash

node ../../bin/cli.js --help > "my assets/help.txt"
DEBUG=* node ../../bin/cli.js -r "./my assets" -i ./README.template.md  -o ./README.md
if [ $? -eq 0 ]; 
then 
    echo "OK" 
else 
    echo "FAIL" 
fi
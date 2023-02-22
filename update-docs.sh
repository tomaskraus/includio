#!/bin/bash
# exit when any command fails.
set -e

cd examples/example_1
. run.sh
cd ../../

cd examples/example_2
. run.sh
cd ../../

DEBUG=* node ./bin/cli.js -i README.template.md  -o README.md
if [ $? -eq 0 ]; 
then 
    echo "OK" 
else 
    echo "FAIL" 
fi
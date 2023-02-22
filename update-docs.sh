#!/bin/bash
# exit when any command fails.
set -e

echo 'generating CLI help...'
node ./bin/cli.js --help > "examples/assets/help.txt"

echo 'generating example 1...'
cd examples/example_1
. run.sh
cd ../../

echo 'generating example 2...'
cd examples/example_2
. run.sh
cd ../../

echo 'processing the main template...'
DEBUG=* node ./bin/cli.js -i README.template.md  -o README.md
if [ $? -eq 0 ]; 
then 
    echo "OK" 
else 
    echo "FAIL" 
fi
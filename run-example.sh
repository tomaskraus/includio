node bin/cli.js --help > examples/complex-example/assets/help.txt
DEBUG=* node ./bin/cli.js -r "./examples/complex-example/my assets" -i ./examples/complex-example/README.template.md  -o ./examples/complex-example/README.md
if [ $? -eq 0 ]; 
then 
    echo "OK" 
else 
    echo "FAIL" 
fi
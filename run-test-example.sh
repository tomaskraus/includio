node ./bin/cli.js -r "./examples/test-example/my assets" -i ./examples/test-example/README.template.md -t
if [ $? -eq 0 ]; 
then 
    echo "OK" 
else 
    echo "FAIL" 
fi
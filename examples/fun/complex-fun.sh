echo "@@ include.txt" 				    \
| node ../../bin/cli.js 				\
| node ../../bin/cli.js 				\
| node ../../bin/cli.js 				\
| node ../../bin/cli.js 				\
| node ../../bin/cli.js -r partial  	\
| node ../../bin/cli.js -r partial 		\
| node ../../bin/cli.js 				\
| node ../../bin/cli.js -r final -o $1
/*
    This is an example of using Includio parts in a js file
*/

//< greet
const greetings = name => `Hello, ${name}!`;
//<

//< printHello
const printHelloWorld = () => console.log(greetings('World'));
//<

printHelloWorld();

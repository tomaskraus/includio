/**
 * This is an example resource file.
 * Contains named parts.
 */

//< add
const add = x => y => x + y;
//<

//< inc
const inc = x => {
  return add(1)(x);
};
//<

//< main

console.log('add(2)(3):', add(2)(3));

console.log('inc(2):', inc(2));
console.log('inc(3):', inc(3));

//<

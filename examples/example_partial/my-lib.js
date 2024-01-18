const add = x => y => x + y;

//< inc-fn
const inc = x => {
  return add(1)(x);
};
//<

console.log(inc(10)); //=> 11

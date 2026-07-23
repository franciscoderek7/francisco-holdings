function checkMemory(){

if(
performance &&
performance.memory
){

console.log({
used:
performance.memory.usedJSHeapSize,
limit:
performance.memory.jsHeapSizeLimit
});

}

else{

console.log(
"Memory API unavailable"
);

}

}

checkMemory();


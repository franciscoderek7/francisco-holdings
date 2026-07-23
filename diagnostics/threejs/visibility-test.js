export function testVisibility(object){

if(!object){

console.error(
"Object missing"
);

return false;

}

console.log(
"Object detected",
object
);

return true;

}


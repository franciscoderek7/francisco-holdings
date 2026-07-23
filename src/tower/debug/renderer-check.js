export function checkRenderer(renderer){

if(!renderer){

console.error(
"THREE RENDERER NOT FOUND"
);

return false;

}

console.log(
"THREE RENDERER ACTIVE"
);

return true;

}


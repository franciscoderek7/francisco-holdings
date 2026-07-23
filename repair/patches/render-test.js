export function renderTest(renderer,scene,camera){

if(!renderer){
console.error("Renderer missing");
return;
}

if(!scene){
console.error("Scene missing");
return;
}

if(!camera){
console.error("Camera missing");
return;
}

console.log(
"Render pipeline objects detected"
);

}


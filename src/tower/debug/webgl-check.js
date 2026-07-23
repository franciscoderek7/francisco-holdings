export function checkWebGL(){

const canvas=document.createElement("canvas");

const gl =
canvas.getContext("webgl") ||
canvas.getContext("experimental-webgl");

if(gl){
console.log("WEBGL READY");
return true;
}

console.error("WEBGL FAILED");
return false;

}


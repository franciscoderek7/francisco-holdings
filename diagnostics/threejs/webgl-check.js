function checkWebGL(){

if(typeof document==="undefined"){
console.log("Browser required");
return;
}

const canvas=document.createElement("canvas");

const supported=
!!(
window.WebGLRenderingContext &&
(
canvas.getContext("webgl") ||
canvas.getContext("experimental-webgl")
)
);

console.log({
webgl:supported
});

}

checkWebGL();


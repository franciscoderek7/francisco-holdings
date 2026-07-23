export function debugThree(scene,camera,renderer){

console.log(
"THREE DEBUG",
{
sceneChildren:
scene.children.length,

camera:
camera.position,

renderer:
renderer.domElement
}
);

}


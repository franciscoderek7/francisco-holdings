export function setupLights(THREE){

const light =
new THREE.DirectionalLight(
0xffffff,
1
);

light.position.set(
10,
20,
10
);

return light;

}


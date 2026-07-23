export function createTowerShell(THREE){

const geometry =
new THREE.BoxGeometry(
12,
100,
12
);

const material =
new THREE.MeshStandardMaterial();

const tower =
new THREE.Mesh(
geometry,
material
);

return tower;

}


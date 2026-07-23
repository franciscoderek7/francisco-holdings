export function createFloorStack(THREE){

const group =
new THREE.Group();

for(let i=0;i<392;i++){

const geometry =
new THREE.BoxGeometry(
10,
0.2,
10
);

const material =
new THREE.MeshStandardMaterial();

const floor =
new THREE.Mesh(
geometry,
material
);

floor.position.y =
i * 0.25;

floor.userData={
floor:i+1
};

group.add(floor);

}

return group;

}


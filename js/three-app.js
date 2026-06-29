import * as THREE from "three";

let scene, camera, renderer;
let building = [];

const FLOOR_HEIGHT = 6;
const FLOOR_COUNT = 5;

const themes = [
  0xC9A227,
  0x1E90FF,
  0x00C853,
  0xFFFFFF,
  0xB0B0B0
];

init();
animate();

function init() {
  const container = document.getElementById("three-container");

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0a0a0a, 10, 80);

  camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 1000);
  camera.position.set(8, 8, 12);

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(innerWidth, innerHeight);
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 0.4));

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10, 20, 10);
  scene.add(light);

  createBuilding();

  window.addEventListener("resize", onResize);
  window.goToFloor = goToFloor;
}

function createBuilding() {
  const geo = new THREE.BoxGeometry(4, FLOOR_HEIGHT, 4);

  for (let i = 0; i < FLOOR_COUNT; i++) {
    const mat = new THREE.MeshStandardMaterial({
      color: themes[i],
      metalness: 0.6,
      roughness: 0.35
    });

    const floor = new THREE.Mesh(geo, mat);
    floor.position.y = i * FLOOR_HEIGHT;

    floor.userData.index = i + 1;

    scene.add(floor);
    building.push(floor);
  }
}

function goToFloor(floor) {
  const targetY = (floor - 1) * FLOOR_HEIGHT;

  gsap.to(camera.position, {
    y: targetY + 3,
    duration: 1.2,
    ease: "power3.inOut"
  });

  gsap.to(camera.position, {
    x: 8,
    z: 12,
    duration: 1.2
  });

  if (window.onFloorChange) window.onFloorChange(floor);
}

function animate() {
  requestAnimationFrame(animate);

  building.forEach((b, i) => {
    b.rotation.y += 0.002 * (i + 1);
  });

  renderer.render(scene, camera);
}

function onResize() {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
}

window.addEventListener("click", (e) => {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2(
    (e.clientX / innerWidth) * 2 - 1,
    -(e.clientY / innerHeight) * 2 + 1
  );

  raycaster.setFromCamera(mouse, camera);
  const hit = raycaster.intersectObjects(building);

  if (hit.length) {
    goToFloor(hit[0].object.userData.index);
  }
});

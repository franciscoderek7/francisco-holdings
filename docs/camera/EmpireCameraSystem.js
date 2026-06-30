export class EmpireCameraSystem {
  constructor({ camera, renderer, eventBus }) {
    this.camera = camera;
    this.renderer = renderer;
    this.eventBus = eventBus;
    this.modes = ['ORBIT', 'FIRST_PERSON', 'SECURITY', 'DRONE'];
    this.mode = 'ORBIT';
    this.autoRotate = false;
    this._bindEvents();
  }
  _bindEvents() {
    this.eventBus.on('FLOOR_SELECTED', ({ floor }) => this.focusFloor(floor));
    this.eventBus.on('AGENT_ALERT', ({ position }) => this.focusPosition(position));
    this.eventBus.on('CAMERA_MODE', ({ mode }) => this.setMode(mode));
  }
  setMode(mode) {
    if (!this.modes.includes(mode)) return;
    this.mode = mode;
    this.eventBus.emit('CAMERA_CHANGED', { mode });
  }
  focusFloor(floorId) {
    gsap.to(this.camera.position, { x: 30, y: floorId * 40 + 20, z: 30, duration: 2, ease: 'power2.inOut' });
  }
  focusPosition(pos) {
    gsap.to(this.camera.position, { x: pos.x + 10, y: pos.y + 10, z: pos.z + 10, duration: 1.5 });
  }
  orbit() {
    this.autoRotate = true;
    const animate = () => {
      if (!this.autoRotate || this.mode !== 'ORBIT') return;
      const time = Date.now() * 0.0005;
      this.camera.position.x = Math.cos(time) * 50;
      this.camera.position.z = Math.sin(time) * 50;
      this.camera.lookAt(0, 0, 0);
      requestAnimationFrame(animate);
    };
    animate();
  }
  securityScan() {
    this.setMode('SECURITY');
    gsap.to(this.camera.position, { x: 0, y: 200, z: 0, duration: 3, onComplete: () => {
      gsap.to(this.camera.rotation, { y: Math.PI * 2, duration: 4, ease: 'none', onComplete: () => this.setMode('ORBIT') });
    }});
  }
  dispose() { this.autoRotate = false; }
}
export default EmpireCameraSystem;

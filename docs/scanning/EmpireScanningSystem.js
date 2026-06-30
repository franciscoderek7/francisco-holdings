export class EmpireScanningSystem {
  constructor({ scene, eventBus }) {
    this.scene = scene;
    this.eventBus = eventBus;
    this.scannedObjects = new Map();
    this.scanBeam = null;
    this._buildScanBeam();
    this._bindEvents();
  }
  _buildScanBeam() {
    const geo = new THREE.CylinderGeometry(0.5, 2, 100, 8, 1, true);
    const mat = new THREE.MeshBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.1, side: THREE.DoubleSide });
    this.scanBeam = new THREE.Mesh(geo, mat);
    this.scanBeam.visible = false;
    this.scene.add(this.scanBeam);
  }
  _bindEvents() {
    this.eventBus.on('FLOOR_SELECTED', ({ floor }) => this.scanFloor(floor));
    this.eventBus.on('AGENT_SCAN', ({ agentId }) => this.scanAgent(agentId));
  }
  scanFloor(floorId) {
    this.scanBeam.visible = true;
    this.scanBeam.position.set(0, floorId * 40, 0);
    gsap.to(this.scanBeam.rotation, { y: Math.PI * 4, duration: 3, ease: 'power2.inOut', onComplete: () => {
      this.scanBeam.visible = false;
      this._reportScan('floor', floorId);
    }});
  }
  scanAgent(agentId) {
    const agent = this.scene.getObjectByName(agentId);
    if (!agent) return;
    this.scanBeam.visible = true;
    this.scanBeam.position.copy(agent.position);
    gsap.to(this.scanBeam.scale, { x: 2, y: 2, z: 2, duration: 1, yoyo: true, repeat: 1, onComplete: () => {
      this.scanBeam.visible = false;
      this._reportScan('agent', agentId);
    }});
  }
  _reportScan(type, id) {
    this.eventBus.emit('SCAN_COMPLETE', { type, id, timestamp: Date.now(), objects: this.scannedObjects.size });
  }
  dispose() { this.scanBeam?.removeFromParent(); }
}
export default EmpireScanningSystem;

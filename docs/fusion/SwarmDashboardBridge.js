import * as THREE from "three";
import { gsap } from "gsap";

export class SwarmDashboardBridge {
  constructor({ swarm, dashboard, scene, eventBus }) {
    this.swarm = swarm; this.dashboard = dashboard; this.scene = scene; this.eventBus = eventBus;
    this.neuralGraphOverlay = null; this.agentGlowMap = new Map();
    this._init();
  }
  _init() {
    this._buildNeuralGraphOverlay(); this._bindSwarmEvents(); this._bindDashboardEvents(); this._startSyncLoop();
  }
  _buildNeuralGraphOverlay() {
    const canvas = document.createElement("canvas"); canvas.width = 400; canvas.height = 300;
    const ctx = canvas.getContext("2d"); const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.9 });
    const sprite = new THREE.Sprite(material); sprite.position.set(200, 150, 0); sprite.scale.set(400, 300, 1);
    this.scene.add(sprite); this.neuralGraphOverlay = { canvas, ctx, texture, sprite };
  }
  _renderNeuralGraph() {
    const { ctx, canvas, texture } = this.neuralGraphOverlay; const graph = this.swarm.getGraph();
    ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = "rgba(5,10,15,0.85)"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(0,212,255,0.3)"; ctx.lineWidth = 1;
    graph.links.forEach(link => {
      const s = graph.nodes.find(n => n.id === link.source); const t = graph.nodes.find(n => n.id === link.target);
      if (s && t) { ctx.beginPath(); ctx.moveTo(s.x || 200, s.y || 150); ctx.lineTo(t.x || 200, t.y || 150); ctx.stroke(); }
    });
    graph.nodes.forEach(node => {
      const x = node.x || 200 + (Math.random() - 0.5) * 200; const y = node.y || 150 + (Math.random() - 0.5) * 150;
      node.x = x; node.y = y; ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = node.status === "ACTIVE" ? "#00ff88" : node.status === "DEGRADED" ? "#ffcc00" : "#ff4444"; ctx.fill();
      ctx.strokeStyle = "#00d4ff"; ctx.lineWidth = 1; ctx.stroke();
    });
    texture.needsUpdate = true;
  }
  _bindSwarmEvents() {
    this.eventBus.on("NEURAL_GRAPH_UPDATE", () => this._renderNeuralGraph());
    this.eventBus.on("TIMMY_UPDATE", (timmy) => this._updateTimmyDisplay(timmy));
    this.eventBus.on("AGENT_ACTIVITY", (entry) => this._flashActivity(entry));
  }
  _bindDashboardEvents() {
    this.eventBus.on("FLOOR_SELECTED", (data) => this._showFloorAgents(data.floor));
    this.eventBus.on("AGENT_ASSIGN_TASK", (data) => this.swarm.dispatchTask(data.task));
  }
  _showFloorAgents(floorId) {
    const agents = [...this.swarm.agents.values()].filter(a => { const companyNum = parseInt(a.companyId.split("-")[1]) || 1; return companyNum === floorId; });
    this.eventBus.emit("DASHBOARD_AGENTS_SHOW", { floor: floorId, agents });
  }
  _updateTimmyDisplay(timmy) {
    const el = document.getElementById("timmy-status");
    if (el) el.innerHTML = `Agents: ${timmy.active}/${timmy.total} | Degraded: ${timmy.degraded} | Failed: ${timmy.failed}`;
  }
  _flashActivity(entry) {
    const el = document.getElementById("activity-feed");
    if (el) {
      const div = document.createElement("div"); div.style.cssText = "padding:4px;font-size:10px;color:#00d4ff;border-bottom:1px solid rgba(0,212,255,0.1);";
      div.textContent = `${entry.type}: ${JSON.stringify(entry.data).slice(0, 60)}`; el.insertBefore(div, el.firstChild);
      if (el.children.length > 50) el.removeChild(el.lastChild);
    }
  }
  _startSyncLoop() {
    setInterval(() => { this._updateAgentGlow(); this._renderNeuralGraph(); }, 2000);
  }
  _updateAgentGlow() {
    this.swarm.agents.forEach((agent, id) => {
      const companyNum = parseInt(agent.companyId.split("-")[1]) || 1;
      const floorMesh = this.scene.getObjectByName(`Floor_${companyNum}`);
      if (floorMesh) {
        const color = agent.status === "ACTIVE" ? 0x00ff88 : agent.status === "DEGRADED" ? 0xffcc00 : 0xff4444;
        gsap.to(floorMesh.material.emissive, { r: (color >> 16 & 255) / 255, g: (color >> 8 & 255) / 255, b: (color & 255) / 255, duration: 1 });
      }
    });
  }
  dispose() { this.neuralGraphOverlay?.sprite?.removeFromParent(); this.agentGlowMap.clear(); }
}

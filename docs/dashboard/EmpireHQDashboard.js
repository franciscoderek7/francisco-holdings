import * as THREE from "three";
import { gsap } from "gsap";

  constructor({ scene, camera, renderer, eventBus, queryEngine, stateManager, monitor, onFloorSelect }) {
    this.scene = scene; this.camera = camera; this.renderer = renderer;
    this.eventBus = eventBus; this.query = queryEngine; this.state = stateManager;
    this.monitor = monitor; this.onFloorSelect = onFloorSelect;
    this.root = null; this.panels = {}; this.selectedFloor = 1;
    this.fps = 0; this.frames = 0; this.lastTime = performance.now();
    this.floorCache = []; this.visibleRange = { start: 0, end: 30 };
    this._init();
  }

  _init() {
    this._buildRootUI(); this._buildPanels(); this._buildElevator();
    this._bindEvents(); this._startTelemetryLoop();
    this.eventBus.on("STATE_CHANGED", () => this.refresh());
    this.eventBus.on("REVENUE_UPDATED", () => this._updateRevenue());
    this.eventBus.on("FLOOR_CHANGED", (f) => this._onFloorChange(f));
  }

  _buildRootUI() {
    const root = document.createElement("div");
    root.id = "empire-hq-dashboard";
    root.style.cssText = "position:fixed;top:0;right:0;width:420px;height:100vh;background:rgba(5,10,15,0.92);backdrop-filter:blur(12px);border-left:1px solid #00d4ff;color:#e6f7ff;font-family:Arial,sans-serif;z-index:999999;display:flex;flex-direction:column;overflow:hidden;";
    document.body.appendChild(root); this.root = root;
  }

  _buildPanels() {
    this._buildHeader(); this._buildMetricsPanel(); this._buildFloorElevator();
    this._buildAgentPanel(); this._buildPerformancePanel();
  }

  _buildHeader() {
    const header = document.createElement("div");
    header.style.cssText = "padding:16px;border-bottom:1px solid #00d4ff;background:linear-gradient(90deg,rgba(0,212,255,0.15),transparent);";
    header.innerHTML = `<div style="font-size:16px;font-weight:bold;color:#00d4ff;">EMPIRE HQ COMMAND CENTER</div><div style="font-size:11px;opacity:0.7;margin-top:4px;">Francisco Holdings Inc. — 392 Floor System</div><div style="font-size:10px;color:#d4af37;margin-top:6px;">"Most dangerous legal education platform in the world"</div>`;
    this.root.appendChild(header); this.panels.header = header;
  }

  _buildMetricsPanel() {
    const panel = document.createElement("div");
    panel.style.cssText = "padding:12px;border-bottom:1px solid rgba(0,212,255,0.2);";
    panel.innerHTML = `<div style="font-size:12px;color:#00d4ff;margin-bottom:8px;">REAL-TIME METRICS</div><div id="metrics-revenue">Revenue: --</div><div id="metrics-floors">Floors: --</div><div id="metrics-agents">Agents: --</div><div id="metrics-health">System: --</div>`;
    this.root.appendChild(panel); this.panels.metrics = panel;
  }

  _buildFloorElevator() {
    const panel = document.createElement("div");
    panel.style.cssText = "flex:1;overflow-y:auto;padding:12px;";
    const list = document.createElement("div"); list.id = "floor-list";
    panel.appendChild(list); this.root.appendChild(panel); this.panels.elevator = panel;
    this._renderFloorList();
  }

  _buildAgentPanel() {
    const panel = document.createElement("div");
    panel.style.cssText = "padding:12px;border-top:1px solid rgba(0,212,255,0.2);";
    panel.innerHTML = `<div style="font-size:12px;color:#00d4ff;">AGENT SWARM</div><div id="agent-status">Loading...</div>`;
    this.root.appendChild(panel); this.panels.agents = panel;
  }

  _buildPerformancePanel() {
    const panel = document.createElement("div");
    panel.style.cssText = "padding:12px;border-top:1px solid rgba(0,212,255,0.2);font-size:11px;opacity:0.8;";
    panel.innerHTML = `<div style="color:#d4af37;">PERFORMANCE</div><div id="fps">FPS: --</div><div id="memory">Memory: --</div><div id="drawcalls">Draw Calls: --</div>`;
    this.root.appendChild(panel); this.panels.performance = panel;
  }

  _buildElevator() {
    const floors = [];
    for (let i = 1; i <= 392; i++) {
      floors.push({ id: i, name: this._getFloorName(i), revenue: Math.floor(Math.random() * 10000), status: "ACTIVE" });
    }
    this.floorCache = floors;
  }

  _getFloorName(id) {
    if (id === 1) return "Phantom Lounge (Revenue Core)";
    if (id === 2) return "OmniGuard Security";
    if (id === 3) return "PrimeDox AI (Bugatti Layer)";
    if (id === 10) return "Vault Velocity Finance";
    if (id < 50) return "Enterprise Operations";
    if (id < 150) return "Global Intelligence";
    if (id < 300) return "Sovereign Infrastructure";
    return "Sky Dominion";
  }

  _renderFloorList() {
    const list = document.getElementById("floor-list");
    if (!list) return; list.innerHTML = "";
    const visible = this.floorCache.slice(this.visibleRange.start, this.visibleRange.end);
    visible.forEach((floor) => {
      const el = document.createElement("div");
      el.style.cssText = `padding:10px;margin-bottom:6px;border:1px solid rgba(0,212,255,0.2);cursor:pointer;font-size:12px;${floor.id === this.selectedFloor ? 'background:rgba(0,212,255,0.15);' : ''}`;
      el.innerHTML = `<div style="color:#00d4ff;">Floor ${floor.id}</div><div style="font-size:10px;opacity:0.7;">${floor.name}</div><div style="color:#d4af37;font-size:10px;">$${floor.revenue}</div>`;
      el.onclick = () => this._selectFloor(floor.id); list.appendChild(el);
    });
  }

  _selectFloor(id) {
    this.selectedFloor = id;
    this.eventBus.emit("FLOOR_SELECTED", { floor: id });
    if (this.onFloorSelect) this.onFloorSelect(id);
    this._renderFloorList();
  }

  _startTelemetryLoop() {
    const loop = () => {
      this._updateFPS(); this._updateMetrics(); this._updateAgents();
      requestAnimationFrame(loop);
    }; loop();
  }

  _updateFPS() {
    const now = performance.now(); this.frames++;
    if (now - this.lastTime >= 1000) {
      this.fps = this.frames; this.frames = 0; this.lastTime = now;
      const el = document.getElementById("fps"); if (el) el.textContent = `FPS: ${this.fps}`;
    }
  }

  _updateMetrics() {
    const revenue = this.query?.query("revenue.total") || "0";
    const floors = this.query?.query("floors.occupancy") || { active: 1, total: 392 };
    const system = this.query?.query("system.health") || "ONLINE";
    const el1 = document.getElementById("metrics-revenue"); if (el1) el1.textContent = `Revenue: $${revenue}`;
    const el2 = document.getElementById("metrics-floors"); if (el2) el2.textContent = `Floors: ${floors.active}/${floors.total}`;
    const el3 = document.getElementById("metrics-health"); if (el3) el3.textContent = `System: ${system}`;
  }

  _updateAgents() {
    const agents = this.query?.query("agents.active") || "0";
    const el = document.getElementById("agent-status"); if (el) el.textContent = `Active Agents: ${agents}`;
  }

  _bindEvents() {
    this.eventBus.on("FLOOR_CHANGED", (data) => { this.selectedFloor = data.floor; this._renderFloorList(); });
    this.eventBus.on("REVENUE_UPDATED", () => this._updateMetrics());
  }

  refresh() { this._updateRevenue(); this._updateAgents(); this._updateMetrics(); this._renderFloorList(); }

  _onFloorChange(data) { if (!data?.floor) return; this.selectedFloor = data.floor; this._renderFloorList(); }

  dispose() { this.root?.remove(); this.floorCache = []; }
}

/**
 * EmpireNervousSystem.js
 * Central Event Bus & Agent Swarm Wiring for Francisco Holdings Inc.
 * Professor: OpenAI | Student: Derek Francisco
 */

class EmpireNervousSystem {
  constructor() {
    this.channels = new Map();
    this.agents = new Map();
    this.floors = new Map();
    this.middleware = [];
    this.metrics = { messagesRouted: 0, agentsRegistered: 0, errors: 0 };
    this.initialized = false;
  }

  init() {
    if (this.initialized) return this;
    this.channels.set('global', new Set());
    this.channels.set('system', new Set());
    this.channels.set('agent-swarm', new Set());
    for (let i = 1; i <= 392; i++) {
      this.channels.set(`floor-${i}`, new Set());
    }
    this.initialized = true;
    this.emit('system', { type: 'NERVOUS_SYSTEM_ONLINE', timestamp: Date.now() });
    return this;
  }

  registerAgent(agentId, config = {}) {
    if (this.agents.has(agentId)) {
      console.warn(`NervousSystem: Agent ${agentId} already registered`);
      return false;
    }
    const agent = {
      id: agentId,
      floor: config.floor || null,
      channels: new Set(config.channels || ['global']),
      capabilities: config.capabilities || [],
      status: 'active',
      registeredAt: Date.now()
    };
    this.agents.set(agentId, agent);
    agent.channels.forEach(ch => {
      if (!this.channels.has(ch)) this.channels.set(ch, new Set());
      this.channels.get(ch).add(agentId);
    });
    this.metrics.agentsRegistered++;
    this.emit('system', { type: 'AGENT_REGISTERED', agentId, floor: agent.floor });
    return agent;
  }

  unregisterAgent(agentId) {
    const agent = this.agents.get(agentId);
    if (!agent) return false;
    agent.channels.forEach(ch => {
      this.channels.get(ch)?.delete(agentId);
    });
    this.agents.delete(agentId);
    this.emit('system', { type: 'AGENT_UNREGISTERED', agentId });
    return true;
  }

  subscribe(agentId, channel) {
    const agent = this.agents.get(agentId);
    if (!agent) return false;
    if (!this.channels.has(channel)) this.channels.set(channel, new Set());
    this.channels.get(channel).add(agentId);
    agent.channels.add(channel);
    return true;
  }

  unsubscribe(agentId, channel) {
    this.channels.get(channel)?.delete(agentId);
    this.agents.get(agentId)?.channels?.delete(channel);
    return true;
  }

  use(middlewareFn) {
    this.middleware.push(middlewareFn);
    return this;
  }

  emit(channel, message) {
    if (!this.initialized) this.init();
    const envelope = {
      id: Math.random().toString(36).slice(2),
      channel,
      payload: message,
      timestamp: Date.now(),
      delivered: []
    };
    let processed = envelope;
    for (const mw of this.middleware) {
      try {
        processed = mw(processed) || processed;
      } catch (e) {
        this.metrics.errors++;
        console.error(`NervousSystem middleware error:`, e);
      }
    }
    const targets = this.channels.get(channel);
    if (!targets) return false;
    targets.forEach(agentId => {
      const agent = this.agents.get(agentId);
      if (agent && agent.status === 'active') {
        try {
          if (typeof agent.onMessage === 'function') {
            agent.onMessage(processed.payload, { agentId, channel, envelope: processed });
          }
          envelope.delivered.push(agentId);
        } catch (e) {
          this.metrics.errors++;
          console.error(`NervousSystem delivery error to ${agentId}:`, e);
        }
      }
    });
    this.metrics.messagesRouted++;
    return envelope.delivered;
  }

  broadcast(message, excludeAgent = null) {
    const results = [];
    this.channels.get('global')?.forEach(agentId => {
      if (agentId !== excludeAgent) {
        const delivered = this.emit('global', { ...message, broadcast: true });
        if (delivered) results.push(...delivered);
      }
    });
    return [...new Set(results)];
  }

  routeToFloor(floorNumber, message) {
    return this.emit(`floor-${floorNumber}`, message);
  }

  getAgentStatus(agentId) {
    return this.agents.get(agentId)?.status || 'unknown';
  }

  setAgentStatus(agentId, status) {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.status = status;
      this.emit('system', { type: 'AGENT_STATUS_CHANGE', agentId, status });
      return true;
    }
    return false;
  }

  getFloorAgents(floorNumber) {
    const channel = this.channels.get(`floor-${floorNumber}`);
    if (!channel) return [];
    return Array.from(channel).map(id => this.agents.get(id)).filter(Boolean);
  }

  getMetrics() {
    return { ...this.metrics, channelCount: this.channels.size };
  }

  reset() {
    this.channels.clear();
    this.agents.clear();
    this.middleware = [];
    this.metrics = { messagesRouted: 0, agentsRegistered: 0, errors: 0 };
    this.initialized = false;
  }
}

const EmpireNervous = new EmpireNervousSystem();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EmpireNervousSystem, EmpireNervous };
} else if (typeof window !== 'undefined') {
  window.EmpireNervousSystem = EmpireNervousSystem;
  window.EmpireNervous = EmpireNervous;
}


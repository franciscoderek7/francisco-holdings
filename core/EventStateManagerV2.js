/**
 * EmpireEventStateManagerV2.js
 * Core Event-Driven State Management for Francisco Holdings Inc.
 * CQRS Write Model | 392-Floor State Tree | Agent Swarm Events
 * Professor: OpenAI | Student: Derek Francisco
 */

class EmpireEventStateManagerV2 {
  constructor() {
    this.events = [];
    this.state = this.getInitialState();
    this.subscribers = new Map();
    this.eventIndex = 0;
    this.maxEvents = 10000;
    this.isReplaying = false;
    this.metrics = { eventsProcessed: 0, lastSnapshot: Date.now() };
  }

  getInitialState() {
    return {
      floors: new Array(392).fill(null).map((_, i) => ({
        id: i + 1,
        active: i === 0,
        company: null,
        revenue: 0,
        agents: [],
        status: 'standby'
      })),
      global: {
        activeFloor: 1,
        totalRevenue: 0,
        agentCount: 0,
        systemStatus: 'online',
        lastUpdate: Date.now()
      },
      user: {
        authenticated: false,
        soulStack: [],
        preferences: {}
      }
    };
  }

  emit(eventType, payload, metadata = {}) {
    if (this.isReplaying) return;
    const event = {
      id: ++this.eventIndex,
      type: eventType,
      payload,
      metadata: { ...metadata, timestamp: Date.now() },
      stateSnapshot: null
    };
    this.events.push(event);
    this.applyEvent(event);
    this.metrics.eventsProcessed++;
    if (this.eventIndex % 100 === 0) this.createSnapshot();
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents / 2);
      this.createSnapshot();
    }
    this.notify(eventType, event);
    return event;
  }

  applyEvent(event) {
    const { type, payload } = event;
    const s = this.state;
    switch (type) {
      case 'FLOOR_ACTIVATE':
        if (payload.floor >= 1 && payload.floor <= 392) {
          s.floors[payload.floor - 1].active = true;
          s.global.activeFloor = payload.floor;
        }
        break;
      case 'FLOOR_DEACTIVATE':
        if (payload.floor >= 1 && payload.floor <= 392) {
          s.floors[payload.floor - 1].active = false;
        }
        break;
      case 'FLOOR_UPDATE_COMPANY':
        if (payload.floor >= 1 && payload.floor <= 392) {
          s.floors[payload.floor - 1].company = payload.company;
        }
        break;
      case 'AGENT_REGISTER':
        s.global.agentCount++;
        if (payload.floor) s.floors[payload.floor - 1].agents.push(payload.agent);
        break;
      case 'AGENT_UNREGISTER':
        s.global.agentCount = Math.max(0, s.global.agentCount - 1);
        break;
      case 'REVENUE_UPDATE':
        s.global.totalRevenue += payload.amount || 0;
        if (payload.floor) s.floors[payload.floor - 1].revenue += payload.amount || 0;
        break;
      case 'USER_LOGIN':
        s.user.authenticated = true;
        s.user.soulStack = payload.soulStack || [];
        break;
      case 'USER_LOGOUT':
        s.user.authenticated = false;
        break;
      case 'SYSTEM_STATUS':
        s.global.systemStatus = payload.status || 'online';
        break;
      case 'STATE_REPLACE':
        if (payload.state) this.state = { ...this.state, ...payload.state };
        break;
      default:
        if (payload.path) this.setPath(s, payload.path, payload.value);
    }
    s.global.lastUpdate = Date.now();
  }

  setPath(obj, path, value) {
    const keys = path.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
  }

  getPath(obj, path) {
    return path.split('.').reduce((o, k) => o?.[k], obj);
  }

  query(path) {
    return path ? this.getPath(this.state, path) : { ...this.state };
  }

  getFloor(floorId) {
    if (floorId < 1 || floorId > 392) return null;
    return { ...this.state.floors[floorId - 1] };
  }

  getActiveFloors() {
    return this.state.floors.filter(f => f.active).map(f => ({ ...f }));
  }

  subscribe(eventType, callback, options = {}) {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set());
    }
    const sub = { callback, id: Math.random().toString(36).slice(2), options };
    this.subscribers.get(eventType).add(sub);
    return () => this.subscribers.get(eventType)?.delete(sub);
  }

  subscribeToAll(callback) {
    return this.subscribe('*', callback);
  }

  notify(eventType, event) {
    const targets = new Set();
    if (this.subscribers.has(eventType)) {
      this.subscribers.get(eventType).forEach(s => targets.add(s));
    }
    if (this.subscribers.has('*')) {
      this.subscribers.get('*').forEach(s => targets.add(s));
    }
    targets.forEach(sub => {
      try {
        if (sub.options.debounce) {
          clearTimeout(sub._debounce);
          sub._debounce = setTimeout(() => sub.callback(event), sub.options.debounce);
        } else {
          sub.callback(event);
        }
      } catch (e) {
        console.error(`EventStateManager: Subscriber error on ${eventType}`, e);
      }
    });
  }

  createSnapshot() {
    const snapshot = {
      index: this.eventIndex,
      timestamp: Date.now(),
      state: JSON.parse(JSON.stringify(this.state))
    };
    this.metrics.lastSnapshot = snapshot.timestamp;
    try {
      localStorage.setItem('empire_state_snapshot', JSON.stringify(snapshot));
    } catch (e) {}
    return snapshot;
  }

  restoreSnapshot() {
    try {
      const raw = localStorage.getItem('empire_state_snapshot');
      if (raw) {
        const snapshot = JSON.parse(raw);
        this.state = snapshot.state;
        this.eventIndex = snapshot.index;
        return snapshot;
      }
    } catch (e) {
      console.error('Snapshot restore failed', e);
    }
    return null;
  }

  replay(fromIndex = 0) {
    this.isReplaying = true;
    const eventsToReplay = this.events.filter(e => e.id >= fromIndex);
    this.state = this.getInitialState();
    eventsToReplay.forEach(e => this.applyEvent(e));
    this.isReplaying = false;
    return { replayed: eventsToReplay.length, state: this.query() };
  }

  batch(eventList) {
    return eventList.map(ev => this.emit(ev.type, ev.payload, ev.metadata));
  }

  getMetrics() {
    return {
      ...this.metrics,
      subscriberCount: this.subscribers.size,
      eventQueueLength: this.events.length
    };
  }

  reset() {
    this.events = [];
    this.eventIndex = 0;
    this.state = this.getInitialState();
    this.subscribers.clear();
    this.metrics = { eventsProcessed: 0, lastSnapshot: Date.now() };
  }
}

const EmpireEventStateManager = new EmpireEventStateManagerV2();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EmpireEventStateManager, EmpireEventStateManagerV2 };
} else if (typeof window !== 'undefined') {
  window.EmpireEventStateManager = EmpireEventStateManager;
  window.EmpireEventStateManagerV2 = EmpireEventStateManagerV2;
}

export { EmpireEventStateManager, EmpireEventStateManagerV2 };

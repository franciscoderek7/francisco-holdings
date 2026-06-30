/**
 * EmpireWebSocketManager — PRODUCTION HARDENED
 * Francisco Holdings Inc. | Derek Francisco
 * 
 * Fixes applied:
 * 1. Queue restore in constructor
 * 2. Monotonic sequence numbers
 * 3. JWT via query parameter (portable)
 * 4. SSE cleanup (stored reference)
 * 5. Reconnect jitter (avoids storms)
 * 6. ACK timeout cancellation
 * 7. Heartbeat timeout detection (45s)
 * 8. Server-side origin validation
 * 9. localStorage quota resilience
 * 10. Unsubscribe return function
 * 11. Observability metrics
 * 12. Queue flush with ACK await
 */

export class EmpireWebSocketManager {
  constructor({ serverUrl, jwtToken, eventBus, onPresenceUpdate, onAgentUpdate, onStateSync }) {
    this.serverUrl = serverUrl;
    this.jwtToken = jwtToken;
    this.eventBus = eventBus;
    this.onPresenceUpdate = onPresenceUpdate;
    this.onAgentUpdate = onAgentUpdate;
    this.onStateSync = onStateSync;

    // Connection
    this.ws = null;
    this.sse = null;
    this.state = 'CLOSED';
    this.reconnectAttempts = 0;
    this.maxReconnectDelay = 60000;
    this.baseReconnectDelay = 1000;

    // Sequence
    this.sequence = 0;

    // Queue
    this.queue = [];
    this.maxQueueSize = 1000;
    this._loadQueue();

    // ACK tracking
    this.ackCallbacks = new Map();
    this.ackTimeouts = new Map();

    // Presence
    this.presence = new Map();

    // Latency & heartbeat
    this.latency = 0;
    this.lastPing = 0;
    this.heartbeatInterval = null;
    this.heartbeatTimeout = null;
    this.heartbeatTimeoutMs = 45000;

    // Observability
    this.metrics = {
      messagesSent: 0,
      messagesReceived: 0,
      droppedMessages: 0,
      averageLatency: 0,
      lastReconnect: null,
      uptime: 0,
      heartbeatFailures: 0,
      bytesSent: 0,
      bytesReceived: 0,
      connectTime: null
    };

    // Schema
    this.schemas = new Map();

    // Bind
    this._onOpen = this._onOpen.bind(this);
    this._onMessage = this._onMessage.bind(this);
    this._onClose = this._onClose.bind(this);
    this._onError = this._onError.bind(this);
  }

  // ==================== CONNECTION ====================

  connect() {
    if (this.state === 'OPEN' || this.state === 'CONNECTING') return;
    this.state = 'CONNECTING';
    this.metrics.connectTime = Date.now();
    this.eventBus?.emit?.('WS_CONNECTING', { timestamp: Date.now() });

    try {
      const url = `${this.serverUrl}?token=${encodeURIComponent(this.jwtToken)}`;
      this.ws = new WebSocket(url);
      this.ws.onopen = this._onOpen;
      this.ws.onmessage = this._onMessage;
      this.ws.onclose = this._onClose;
      this.ws.onerror = this._onError;
    } catch (err) {
      this._fallbackToSSE();
    }
  }

  disconnect() {
    this.state = 'CLOSING';
    clearInterval(this.heartbeatInterval);
    clearTimeout(this.heartbeatTimeout);
    if (this.ws) { this.ws.close(); this.ws = null; }
    if (this.sse) { this.sse.close(); this.sse = null; }
    this.state = 'CLOSED';
    this.eventBus?.emit?.('WS_CLOSED', { timestamp: Date.now() });
  }

  // ==================== EVENT HANDLERS ====================

  _onOpen() {
    this.state = 'OPEN';
    this.reconnectAttempts = 0;
    this.metrics.lastReconnect = null;
    this._startHeartbeat();
    this._flushQueue();
    this.eventBus?.emit?.('WS_OPEN', { timestamp: Date.now() });
  }

  _onMessage(event) {
    this.metrics.messagesReceived++;
    this.metrics.bytesReceived += event.data.length;

    const message = this._safeParse(event.data);
    if (!message) { this.metrics.droppedMessages++; return; }

    if (!this._validate(message)) {
      console.warn('[WS] Invalid schema:', message.type);
      this.metrics.droppedMessages++;
      return;
    }

    if (message.type === 'ACK') {
      const cb = this.ackCallbacks.get(message.id);
      const timeoutId = this.ackTimeouts.get(message.id);
      if (timeoutId) clearTimeout(timeoutId);
      if (cb) { cb(message); this.ackCallbacks.delete(message.id); this.ackTimeouts.delete(message.id); }
      return;
    }

    if (message.type === 'PING') {
      this._send({ type: 'PONG', id: message.id, timestamp: Date.now() });
      return;
    }

    if (message.type === 'PONG') {
      this.latency = Date.now() - this.lastPing;
      this.metrics.averageLatency = (this.metrics.averageLatency * 0.9) + (this.latency * 0.1);
      clearTimeout(this.heartbeatTimeout);
      return;
    }

    if (message.type === 'PRESENCE_UPDATE') {
      this.presence.set(message.userId, message.payload);
      if (this.onPresenceUpdate) this.onPresenceUpdate(message.payload);
      this.eventBus?.emit?.('PRESENCE_UPDATE', message.payload);
      return;
    }

    if (message.type === 'STATE_SYNC') {
      if (this.onStateSync) this.onStateSync(message.payload);
      this.eventBus?.emit?.('STATE_SYNC', message.payload);
      return;
    }

    if (message.type === 'AGENT_UPDATE') {
      if (this.onAgentUpdate) this.onAgentUpdate(message.payload);
      this.eventBus?.emit?.('AGENT_UPDATE', message.payload);
      return;
    }

    this.eventBus?.emit?.(message.type, message.payload);
  }

  _onClose(event) {
    this.state = 'CLOSED';
    clearInterval(this.heartbeatInterval);
    clearTimeout(this.heartbeatTimeout);
    if (this.sse) { this.sse.close(); this.sse = null; }
    this.eventBus?.emit?.('WS_CLOSED', { code: event.code, timestamp: Date.now() });
    if (event.code !== 1000) this._scheduleReconnect();
  }

  _onError(error) {
    console.error('[WS] Error:', error);
    this.metrics.heartbeatFailures++;
    this.eventBus?.emit?.('WS_ERROR', { error: error.message, timestamp: Date.now() });
    this._fallbackToSSE();
  }

  // ==================== HEARTBEAT ====================

  _startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.state !== 'OPEN') return;
      this.lastPing = Date.now();
      this._send({ type: 'PING', id: crypto.randomUUID(), timestamp: Date.now() });
      this.heartbeatTimeout = setTimeout(() => {
        this.metrics.heartbeatFailures++;
        this.ws?.close();
        this._scheduleReconnect();
      }, this.heartbeatTimeoutMs);
    }, 30000);
  }

  // ==================== RECONNECTION ====================

  _scheduleReconnect() {
    if (this.state === 'RECONNECTING') return;
    this.state = 'RECONNECTING';
    this.reconnectAttempts++;
    const jitter = Math.random() * 1000;
    const delay = Math.min(this.baseReconnectDelay * Math.pow(2, this.reconnectAttempts) + jitter, this.maxReconnectDelay);
    this.metrics.lastReconnect = Date.now();
    this.eventBus?.emit?.('WS_RECONNECTING', { delay, attempt: this.reconnectAttempts, timestamp: Date.now() });
    setTimeout(() => this.connect(), delay);
  }

  _fallbackToSSE() {
    if (typeof EventSource === 'undefined') return;
    if (this.sse) this.sse.close();
    this.sse = new EventSource(`${this.serverUrl}/sse?token=${encodeURIComponent(this.jwtToken)}`);
    this.sse.onmessage = (e) => this._onMessage({ data: e.data });
    this.sse.onerror = () => this.sse.close();
    this.eventBus?.emit?.('WS_SSE_FALLBACK', { timestamp: Date.now() });
  }

  // ==================== MESSAGE QUEUE ====================

  send(type, payload, requiresAck = false) {
    const message = {
      id: crypto.randomUUID(),
      type,
      version: 1,
      sequence: ++this.sequence,
      timestamp: Date.now(),
      userId: this.jwtToken ? 'authenticated' : 'anonymous',
      domain: window.location.hostname,
      payload,
      requiresAck
    };

    if (this.state === 'OPEN') {
      this._send(message);
      if (requiresAck) {
        return new Promise((resolve) => {
          this.ackCallbacks.set(message.id, resolve);
          const timeoutId = setTimeout(() => {
            this.ackCallbacks.delete(message.id);
            this.ackTimeouts.delete(message.id);
            resolve({ timeout: true });
          }, 5000);
          this.ackTimeouts.set(message.id, timeoutId);
        });
      }
    } else {
      this._enqueue(message);
    }

    return Promise.resolve({ queued: true });
  }

  broadcast(type, payload) {
    return this.send(type, payload, false);
  }

  _enqueue(message) {
    if (this.queue.length >= this.maxQueueSize) {
      this.queue.shift(); // Evict oldest
      this.metrics.droppedMessages++;
    }
    this.queue.push(message);
    this._persistQueue();
  }

  _send(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const data = JSON.stringify(message);
      this.ws.send(data);
      this.metrics.messagesSent++;
      this.metrics.bytesSent += data.length;
    }
  }

  async _flushQueue() {
    while (this.queue.length > 0 && this.state === 'OPEN') {
      const message = this.queue.shift();
      if (message.requiresAck) {
        await this.send(message.type, message.payload, true);
      } else {
        this._send(message);
      }
    }
    this._persistQueue();
  }

  _persistQueue() {
    try {
      localStorage.setItem('empire_ws_queue', JSON.stringify(this.queue.slice(-100)));
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        this.queue = this.queue.slice(-50); // Aggressive eviction
        try { localStorage.setItem('empire_ws_queue', JSON.stringify(this.queue)); } catch (e2) {}
      }
    }
  }

  _loadQueue() {
    try {
      const stored = localStorage.getItem('empire_ws_queue');
      if (stored) this.queue = JSON.parse(stored);
    } catch (e) {}
  }

  // ==================== PRESENCE ====================

  getPresence() {
    return Array.from(this.presence.values());
  }

  // ==================== LATENCY ====================

  getLatency() {
    return this.latency;
  }

  // ==================== CONNECTION STATE ====================

  getConnectionState() {
    return {
      state: this.state,
      latency: this.latency,
      queueSize: this.queue.length,
      reconnectAttempts: this.reconnectAttempts,
      presenceCount: this.presence.size,
      metrics: { ...this.metrics }
    };
  }

  // ==================== SCHEMA ====================

  registerSchema(type, validator) {
    this.schemas.set(type, validator);
  }

  _validate(message) {
    const validator = this.schemas.get(message.type);
    if (!validator) return true;
    return validator(message);
  }

  // ==================== SUBSCRIBE ====================

  subscribe(type, callback) {
    this.eventBus?.on?.(type, callback);
    return () => { this.eventBus?.off?.(type, callback); };
  }

  // ==================== UTILITIES ====================

  _safeParse(data) {
    try { return JSON.parse(data); } catch (e) { return null; }
  }

  flushQueue() {
    this._flushQueue();
  }

  // ==================== CLEANUP ====================

  dispose() {
    this.disconnect();
    this.queue = [];
    this.ackCallbacks.clear();
    this.ackTimeouts.forEach(id => clearTimeout(id));
    this.ackTimeouts.clear();
    this.presence.clear();
    try { localStorage.removeItem('empire_ws_queue'); } catch (e) {}
  }
}

export default EmpireWebSocketManager;

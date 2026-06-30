export class EmpireWebSocketManager {
  constructor({ serverUrl, jwtToken, allowedOrigins, eventBus, onPresenceUpdate, onAgentUpdate, onStateSync }) {
    this.serverUrl = serverUrl; this.jwtToken = jwtToken;
    this.allowedOrigins = allowedOrigins || ['franciscoholdingsinc.com','omniaguard.com','zprimedoxaihq.com','techpetcage.com','vaultvelocityauto.com','cleanswarm.com','kiaros.com'];
    this.eventBus = eventBus; this.onPresenceUpdate = onPresenceUpdate; this.onAgentUpdate = onAgentUpdate; this.onStateSync = onStateSync;
    this.ws = null; this.state = 'CLOSED'; this.reconnectAttempts = 0; this.maxReconnectDelay = 60000;
    this.queue = []; this.ackCallbacks = new Map(); this.presence = new Map(); this.latency = 0; this.lastPing = 0;
    this.heartbeatInterval = null; this.schemas = new Map();
    this._onOpen = this._onOpen.bind(this); this._onMessage = this._onMessage.bind(this);
    this._onClose = this._onClose.bind(this); this._onError = this._onError.bind(this);
    this._loadQueue();
  }
  connect() {
    if (this.state === 'OPEN' || this.state === 'CONNECTING') return;
    this.state = 'CONNECTING'; this.eventBus?.emit?.('WS_CONNECTING', { timestamp: Date.now() });
    try {
      this.ws = new WebSocket(this.serverUrl, ['empire-protocol', `jwt-${this.jwtToken}`]);
      this.ws.onopen = this._onOpen; this.ws.onmessage = this._onMessage; this.ws.onclose = this._onClose; this.ws.onerror = this._onError;
    } catch (err) { this._fallbackToSSE(); }
  }
  disconnect() {
    this.state = 'CLOSING'; clearInterval(this.heartbeatInterval);
    if (this.ws) { this.ws.close(); this.ws = null; }
    this.state = 'CLOSED'; this.eventBus?.emit?.('WS_CLOSED', { timestamp: Date.now() });
  }
  _onOpen() {
    this.state = 'OPEN'; this.reconnectAttempts = 0; this._startHeartbeat(); this._flushQueue();
    this.eventBus?.emit?.('WS_OPEN', { timestamp: Date.now() });
  }
  _onMessage(event) {
    const message = this._safeParse(event.data); if (!message) return;
    if (!this._validate(message)) { console.warn('[WS] Invalid schema:', message.type); return; }
    if (message.type === 'ACK') { const cb = this.ackCallbacks.get(message.id); if (cb) { cb(message); this.ackCallbacks.delete(message.id); } return; }
    if (message.type === 'PING') { this._send({ type: 'PONG', id: message.id }); return; }
    if (message.type === 'PONG') { this.latency = Date.now() - this.lastPing; return; }
    if (message.type === 'PRESENCE_UPDATE') { this.presence.set(message.userId, message.payload); if (this.onPresenceUpdate) this.onPresenceUpdate(message.payload); this.eventBus?.emit?.('PRESENCE_UPDATE', message.payload); return; }
    if (message.type === 'STATE_SYNC') { if (this.onStateSync) this.onStateSync(message.payload); this.eventBus?.emit?.('STATE_SYNC', message.payload); return; }
    if (message.type === 'AGENT_UPDATE') { if (this.onAgentUpdate) this.onAgentUpdate(message.payload); this.eventBus?.emit?.('AGENT_UPDATE', message.payload); return; }
    this.eventBus?.emit?.(message.type, message.payload);
  }
  _onClose(event) {
    this.state = 'CLOSED'; clearInterval(this.heartbeatInterval);
    this.eventBus?.emit?.('WS_CLOSED', { code: event.code, timestamp: Date.now() });
    if (event.code !== 1000) this._scheduleReconnect();
  }
  _onError(error) { console.error('[WS] Error:', error); this.eventBus?.emit?.('WS_ERROR', { error: error.message, timestamp: Date.now() }); this._fallbackToSSE(); }
  _startHeartbeat() { this.heartbeatInterval = setInterval(() => { if (this.state !== 'OPEN') return; this.lastPing = Date.now(); this._send({ type: 'PING', id: crypto.randomUUID(), timestamp: Date.now() }); }, 30000); }
  _scheduleReconnect() {
    if (this.state === 'RECONNECTING') return; this.state = 'RECONNECTING';
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), this.maxReconnectDelay); this.reconnectAttempts++;
    this.eventBus?.emit?.('WS_RECONNECTING', { delay, attempt: this.reconnectAttempts, timestamp: Date.now() });
    setTimeout(() => this.connect(), delay);
  }
  _fallbackToSSE() {
    if (typeof EventSource !== 'undefined') {
      const sse = new EventSource(`${this.serverUrl}/sse?token=${this.jwtToken}`);
      sse.onmessage = (e) => this._onMessage({ data: e.data }); sse.onerror = () => sse.close();
      this.eventBus?.emit?.('WS_SSE_FALLBACK', { timestamp: Date.now() });
    }
  }
  send(type, payload, requiresAck = false) {
    const message = { id: crypto.randomUUID(), type, version: 1, sequence: this.queue.length, timestamp: Date.now(), userId: this.jwtToken ? 'authenticated' : 'anonymous', domain: window.location.hostname, payload, requiresAck };
    if (this.state === 'OPEN') {
      this._send(message);
      if (requiresAck) return new Promise((resolve) => { this.ackCallbacks.set(message.id, resolve); setTimeout(() => { this.ackCallbacks.delete(message.id); resolve({ timeout: true }); }, 5000); });
    } else { this.queue.push(message); this._persistQueue(); }
    return Promise.resolve({ queued: true });
  }
  broadcast(type, payload) { return this.send(type, payload, false); }
  _send(message) { if (this.ws && this.ws.readyState === WebSocket.OPEN) this.ws.send(JSON.stringify(message)); }
  _flushQueue() { while (this.queue.length > 0 && this.state === 'OPEN') { const message = this.queue.shift(); this._send(message); } this._persistQueue(); }
  _persistQueue() { try { localStorage.setItem('empire_ws_queue', JSON.stringify(this.queue)); } catch (e) {} }
  _loadQueue() { try { const stored = localStorage.getItem('empire_ws_queue'); if (stored) this.queue = JSON.parse(stored); } catch (e) {} }
  getPresence() { return Array.from(this.presence.values()); }
  getLatency() { return this.latency; }
  getConnectionState() { return { state: this.state, latency: this.latency, queueSize: this.queue.length, reconnectAttempts: this.reconnectAttempts, presenceCount: this.presence.size }; }
  registerSchema(type, validator) { this.schemas.set(type, validator); }
  _validate(message) { const validator = this.schemas.get(message.type); if (!validator) return true; return validator(message); }
  _safeParse(data) { try { return JSON.parse(data); } catch (e) { console.warn('[WS] Invalid JSON:', data); return null; } }
  subscribe(type, callback) { this.eventBus?.on?.(type, callback); }
  flushQueue() { this._flushQueue(); }
  dispose() { this.disconnect(); this.queue = []; this.ackCallbacks.clear(); this.presence.clear(); try { localStorage.removeItem('empire_ws_queue'); } catch (e) {} }
}
export default EmpireWebSocketManager;

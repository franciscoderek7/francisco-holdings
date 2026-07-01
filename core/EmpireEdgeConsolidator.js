/**
 * EmpireEdgeConsolidator.js
 * Edge Compute, Batching & Deduplication Layer
 * Professor: OpenAI | Student: Derek Francisco
 */

class EmpireEdgeConsolidator {
  constructor() {
    this.cache = new Map();
    this.batchQueue = [];
    this.batchSize = 50;
    this.batchInterval = 100;
    this.dedupWindow = new Map();
    this.dedupTTL = 5000;
    this.edgeNodes = new Map();
    this.metrics = { batched: 0, deduped: 0, cached: 0, flushed: 0 };
    this.timer = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return this;
    this.timer = setInterval(() => this.flushBatch(), this.batchInterval);
    this.initialized = true;
    return this;
  }

  setEdgeNode(floorId, nodeConfig) {
    this.edgeNodes.set(floorId, {
      floor: floorId,
      capacity: nodeConfig.capacity || 100,
      priority: nodeConfig.priority || 1,
      lastSync: Date.now(),
      status: 'active'
    });
    return this;
  }

  cacheSet(key, value, ttl = 30000) {
    const entry = {
      value,
      expires: Date.now() + ttl,
      hits: 0
    };
    this.cache.set(key, entry);
    this.metrics.cached++;
    return entry;
  }

  cacheGet(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return null;
    }
    entry.hits++;
    return entry.value;
  }

  cacheInvalidate(pattern) {
    const regex = new RegExp(pattern);
    let count = 0;
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
        count++;
      }
    }
    return count;
  }

  dedup(key, payload) {
    const hash = this.hash(JSON.stringify({ key, payload }));
    const existing = this.dedupWindow.get(hash);
    if (existing && Date.now() - existing.ts < this.dedupTTL) {
      this.metrics.deduped++;
      return { deduped: true, original: existing.data };
    }
    this.dedupWindow.set(hash, { ts: Date.now(), data: payload });
    this.cleanDedupWindow();
    return { deduped: false };
  }

  hash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = ((h << 5) - h) + str.charCodeAt(i);
      h |= 0;
    }
    return h.toString(36);
  }

  cleanDedupWindow() {
    const now = Date.now();
    for (const [hash, entry] of this.dedupWindow) {
      if (now - entry.ts > this.dedupTTL) {
        this.dedupWindow.delete(hash);
      }
    }
  }

  enqueue(item, options = {}) {
    const dedupResult = this.dedup(item.type || 'default', item);
    if (dedupResult.deduped) return dedupResult;
    const batchItem = {
      ...item,
      _enqueued: Date.now(),
      _priority: options.priority || 1,
      _floor: options.floor || null
    };
    this.batchQueue.push(batchItem);
    if (this.batchQueue.length >= this.batchSize) {
      this.flushBatch();
    }
    return { enqueued: true, queueLength: this.batchQueue.length };
  }

  flushBatch() {
    if (this.batchQueue.length === 0) return [];
    const batch = this.batchQueue.splice(0, this.batchSize);
    this.metrics.batched += batch.length;
    this.metrics.flushed++;
    const byFloor = new Map();
    batch.forEach(item => {
      const floor = item._floor || 'global';
      if (!byFloor.has(floor)) byFloor.set(floor, []);
      byFloor.get(floor).push(item);
    });
    const results = [];
    for (const [floor, items] of byFloor) {
      const node = this.edgeNodes.get(floor);
      if (node && node.status === 'active') {
        results.push({ floor, items, routed: true });
      } else {
        results.push({ floor, items, routed: false, fallback: 'global' });
      }
    }
    return results;
  }

  getBatchStatus() {
    return {
      queueLength: this.batchQueue.length,
      cacheSize: this.cache.size,
      dedupSize: this.dedupWindow.size,
      edgeNodes: this.edgeNodes.size,
      metrics: { ...this.metrics }
    };
  }

  reset() {
    if (this.timer) clearInterval(this.timer);
    this.cache.clear();
    this.batchQueue = [];
    this.dedupWindow.clear();
    this.edgeNodes.clear();
    this.metrics = { batched: 0, deduped: 0, cached: 0, flushed: 0 };
    this.initialized = false;
  }
}

const EmpireEdge = new EmpireEdgeConsolidator();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EmpireEdgeConsolidator, EmpireEdge };
} else if (typeof window !== 'undefined') {
  window.EmpireEdgeConsolidator = EmpireEdgeConsolidator;
  window.EmpireEdge = EmpireEdge;
}

export { EmpireEdgeConsolidator, EmpireEdge };

/**
 * EmpireQueryEngineV2.js
 * Read-Model Projection Cache with CQRS & Event-Driven Invalidation
 * Professor: OpenAI | Student: Derek Francisco
 */

class EmpireQueryEngineV2 {
  constructor() {
    this.projections = new Map();
    this.indexes = new Map();
    this.cache = new Map();
    this.cacheTTL = 60000;
    this.listeners = new Map();
    this.metrics = { queries: 0, hits: 0, misses: 0, invalidations: 0 };
    this.initialized = false;
  }

  init(eventStateManager) {
    if (this.initialized) return this;
    this.esm = eventStateManager;
    if (this.esm) {
      this.esm.subscribe('*', (event) => this.invalidate(event));
    }
    this.initialized = true;
    return this;
  }

  defineProjection(name, builderFn, dependencies = []) {
    this.projections.set(name, {
      builder: builderFn,
      deps: dependencies,
      lastBuild: 0,
      data: null
    });
    return this;
  }

  defineIndex(name, keyFn, filterFn = null) {
    this.indexes.set(name, {
      keyFn,
      filterFn,
      map: new Map(),
      lastUpdate: 0
    });
    return this;
  }

  query(projectionName, params = {}) {
    this.metrics.queries++;
    const cacheKey = `${projectionName}:${JSON.stringify(params)}`;
    const cached = this.cacheGet(cacheKey);
    if (cached) {
      this.metrics.hits++;
      return cached;
    }
    this.metrics.misses++;
    const proj = this.projections.get(projectionName);
    if (!proj) throw new Error(`Projection '${projectionName}' not defined`);
    const state = this.esm ? this.esm.query() : {};
    const result = proj.builder(state, params);
    proj.data = result;
    proj.lastBuild = Date.now();
    this.cacheSet(cacheKey, result);
    return result;
  }

  indexLookup(indexName, key) {
    const idx = this.indexes.get(indexName);
    if (!idx) throw new Error(`Index '${indexName}' not defined`);
    if (Date.now() - idx.lastUpdate > this.cacheTTL) {
      this.rebuildIndex(indexName);
    }
    return idx.map.get(key) || [];
  }

  rebuildIndex(indexName) {
    const idx = this.indexes.get(indexName);
    if (!idx || !this.esm) return;
    const state = this.esm.query();
    idx.map.clear();
    const floors = state.floors || [];
    floors.forEach((floor, i) => {
      if (idx.filterFn && !idx.filterFn(floor)) return;
      const key = idx.keyFn(floor);
      if (!idx.map.has(key)) idx.map.set(key, []);
      idx.map.get(key).push({ ...floor, _index: i });
    });
    idx.lastUpdate = Date.now();
    return idx.map;
  }

  invalidate(event) {
    const type = event.type || '';
    let count = 0;
    for (const [name, proj] of this.projections) {
      if (proj.deps.some(dep => type.includes(dep) || type === dep)) {
        proj.lastBuild = 0;
        proj.data = null;
        count++;
      }
    }
    for (const key of this.cache.keys()) {
      this.cache.delete(key);
      count++;
    }
    for (const idx of this.indexes.values()) {
      idx.lastUpdate = 0;
    }
    this.metrics.invalidations += count;
    this.notifyListeners(event);
    return count;
  }

  cacheSet(key, value, ttl = this.cacheTTL) {
    this.cache.set(key, {
      value,
      expires: Date.now() + ttl
    });
  }

  cacheGet(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return null;
    }
    return entry.value;
  }

  onInvalidate(callback) {
    const id = Math.random().toString(36).slice(2);
    this.listeners.set(id, callback);
    return () => this.listeners.delete(id);
  }

  notifyListeners(event) {
    this.listeners.forEach(cb => {
      try { cb(event); } catch (e) {}
    });
  }

  getMetrics() {
    return {
      ...this.metrics,
      projectionCount: this.projections.size,
      indexCount: this.indexes.size,
      cacheSize: this.cache.size
    };
  }

  reset() {
    this.projections.clear();
    this.indexes.clear();
    this.cache.clear();
    this.listeners.clear();
    this.metrics = { queries: 0, hits: 0, misses: 0, invalidations: 0 };
    this.initialized = false;
  }
}

const EmpireQueryEngine = new EmpireQueryEngineV2();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EmpireQueryEngineV2, EmpireQueryEngine };
} else if (typeof window !== 'undefined') {
  window.EmpireQueryEngineV2 = EmpireQueryEngineV2;
  window.EmpireQueryEngine = EmpireQueryEngine;
}


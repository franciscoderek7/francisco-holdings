export class EmpireAudioSystem {
  constructor({ eventBus }) {
    this.eventBus = eventBus;
    this.context = null;
    this.masterGain = null;
    this._init();
  }
  _init() {
    this.eventBus.on('FLOOR_CHANGED', ({ floor }) => this._playFloorTheme(floor));
    this.eventBus.on('AGENT_ACTIVITY', () => this._playEventSound('agent'));
    this.eventBus.on('REVENUE_UPDATED', () => this._playEventSound('revenue'));
    this.eventBus.on('WS_OPEN', () => this._playEventSound('connect'));
  }
  async _ensureContext() {
    if (!this.context) {
      this.context = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.context.createGain();
      this.masterGain.connect(this.context.destination);
      this.masterGain.gain.value = 0.3;
    }
    if (this.context.state === 'suspended') await this.context.resume();
  }
  async _playFloorTheme(floor) {
    await this._ensureContext();
    const themes = { 1: 261.63, 2: 329.63, 3: 392.00, 10: 440.00 };
    const freq = themes[floor] || 200 + (floor * 2);
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.context.currentTime);
    gain.gain.setValueAtTime(0.1, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 2);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.context.currentTime + 2);
  }
  async _playEventSound(type) {
    await this._ensureContext();
    const freqs = { agent: 880, revenue: 523.25, connect: 659.25 };
    const freq = freqs[type] || 440;
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, this.context.currentTime);
    gain.gain.setValueAtTime(0.05, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.context.currentTime + 0.5);
  }
  setVolume(v) { if (this.masterGain) this.masterGain.gain.value = v; }
  dispose() { if (this.context) this.context.close(); }
}
export default EmpireAudioSystem;

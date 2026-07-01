class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterVolume: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private droneOsc: OscillatorNode | null = null;
  private lfo: OscillatorNode | null = null;
  private filter: BiquadFilterNode | null = null;
  public analyser: AnalyserNode | null = null;
  private intervalId: any = null;
  private active: boolean = false;

  public init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();
    this.masterVolume = this.ctx.createGain();
    this.masterVolume.gain.setValueAtTime(0, this.ctx.currentTime);

    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = "lowpass";
    this.filter.frequency.setValueAtTime(450, this.ctx.currentTime);
    this.filter.Q.setValueAtTime(5, this.ctx.currentTime);

    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 64;

    // Connect nodes
    this.masterVolume.connect(this.filter);
    this.filter.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);
  }

  public start() {
    this.init();
    if (!this.ctx || !this.masterVolume || !this.filter) return;

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    this.active = true;
    this.masterVolume.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 1.5);

    // Create a deep ambient space drone
    this.droneOsc = this.ctx.createOscillator();
    this.droneOsc.type = "sawtooth";
    this.droneOsc.frequency.setValueAtTime(55, this.ctx.currentTime); // A1 note
    
    const droneGain = this.ctx.createGain();
    droneGain.gain.setValueAtTime(0.12, this.ctx.currentTime);

    // LFO to modulate filter frequency for a "breathing" sweep
    this.lfo = this.ctx.createOscillator();
    this.lfo.type = "sine";
    this.lfo.frequency.setValueAtTime(0.1, this.ctx.currentTime); // 10-second cycles

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(150, this.ctx.currentTime); // sweep range

    this.lfo.connect(lfoGain);
    if (this.filter) {
      lfoGain.connect(this.filter.frequency);
    }

    this.droneOsc.connect(droneGain);
    droneGain.connect(this.masterVolume);

    this.droneOsc.start();
    this.lfo.start();

    // Start a randomized slow cosmic arpeggio (C minor pentatonic scale)
    const scale = [130.81, 146.83, 155.56, 174.61, 196.00, 220.00, 261.63, 293.66, 311.13, 349.23, 392.00]; // C3 to G4 notes
    let lastNoteIndex = -1;

    const playArpeggioStep = () => {
      if (!this.ctx || !this.masterVolume || !this.active) return;

      // Pick a random note from the pentatonic scale (avoid repeating last note)
      let index = Math.floor(Math.random() * scale.length);
      while (index === lastNoteIndex) {
        index = Math.floor(Math.random() * scale.length);
      }
      lastNoteIndex = index;
      const freq = scale[index];

      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      oscGain.gain.setValueAtTime(0, this.ctx.currentTime);
      oscGain.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + 0.1);
      oscGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 2.5);

      // Simple echo effect
      const delay = this.ctx.createDelay();
      delay.delayTime.setValueAtTime(0.4, this.ctx.currentTime);
      const delayFeedback = this.ctx.createGain();
      delayFeedback.gain.setValueAtTime(0.4, this.ctx.currentTime);

      osc.connect(oscGain);
      oscGain.connect(this.masterVolume);

      // Wire echo
      oscGain.connect(delay);
      delay.connect(delayFeedback);
      delayFeedback.connect(delay); // loop back
      delayFeedback.connect(this.masterVolume);

      osc.start();
      osc.stop(this.ctx.currentTime + 3);

      this.oscillators.push(osc);
      if (this.oscillators.length > 10) {
        this.oscillators.shift();
      }
    };

    // Play a note every 2 seconds
    this.intervalId = setInterval(playArpeggioStep, 2200);
    playArpeggioStep(); // play first immediately
  }

  public stop() {
    if (!this.ctx || !this.masterVolume) return;

    this.active = false;
    this.masterVolume.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);

    setTimeout(() => {
      if (this.droneOsc) {
        try { this.droneOsc.stop(); } catch (e) {}
        this.droneOsc.disconnect();
        this.droneOsc = null;
      }
      if (this.lfo) {
        try { this.lfo.stop(); } catch (e) {}
        this.lfo.disconnect();
        this.lfo = null;
      }
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
      this.oscillators.forEach(osc => {
        try { osc.stop(); } catch (e) {}
        osc.disconnect();
      });
      this.oscillators = [];
    }, 600);
  }

  public toggle(): boolean {
    if (this.active) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public isPlaying(): boolean {
    return this.active;
  }
}

export const audioEngine = new AudioEngine();

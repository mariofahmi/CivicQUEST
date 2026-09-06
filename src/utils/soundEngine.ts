// Web Audio API Synthesizer (No external audio files needed)

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgmAudio: HTMLAudioElement | null = null;
  private isBgmMuted: boolean = false;
  private bgmVolume: number = 0.28;
  private bgmInitialized: boolean = false;

  constructor() {
    const savedMute = localStorage.getItem('pyduel_muted');
    if (savedMute !== null) {
      this.isMuted = savedMute === 'true';
    }
    const savedBgmMute = localStorage.getItem('pyduel_bgm_muted');
    if (savedBgmMute !== null) {
      this.isBgmMuted = savedBgmMute === 'true';
    }
  }

  // --- Background Music (BGM) Methods ---
  public initBgm(src: string = './bgm.mp3') {
    if (this.bgmInitialized && this.bgmAudio) return;
    this.bgmInitialized = true;

    try {
      this.bgmAudio = new Audio(src);
      this.bgmAudio.loop = true;
      this.bgmAudio.volume = this.bgmVolume;
      this.bgmAudio.preload = 'auto';

      if (!this.isBgmMuted) {
        this.attemptPlayBgm();
      }
    } catch (err) {
      console.warn('Inisialisasi BGM gagal:', err);
    }
  }

  private attemptPlayBgm() {
    if (!this.bgmAudio || this.isBgmMuted) return;

    const playPromise = this.bgmAudio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Browser Autoplay Policy memblokir pemutaran otomatis sebelum interaksi pengguna
        const playOnFirstInteraction = () => {
          if (this.bgmAudio && !this.isBgmMuted) {
            this.bgmAudio.play().catch(() => {});
          }
          window.removeEventListener('click', playOnFirstInteraction);
          window.removeEventListener('keydown', playOnFirstInteraction);
          window.removeEventListener('pointerdown', playOnFirstInteraction);
          window.removeEventListener('touchstart', playOnFirstInteraction);
        };

        window.addEventListener('click', playOnFirstInteraction, { once: true });
        window.addEventListener('keydown', playOnFirstInteraction, { once: true });
        window.addEventListener('pointerdown', playOnFirstInteraction, { once: true });
        window.addEventListener('touchstart', playOnFirstInteraction, { once: true });
      });
    }
  }

  public toggleBgmMute(): boolean {
    this.isBgmMuted = !this.isBgmMuted;
    localStorage.setItem('pyduel_bgm_muted', String(this.isBgmMuted));

    if (!this.bgmAudio) {
      this.initBgm('./bgm.mp3');
    }

    if (this.bgmAudio) {
      if (this.isBgmMuted) {
        this.bgmAudio.pause();
      } else {
        this.attemptPlayBgm();
      }
    }

    return this.isBgmMuted;
  }

  public getIsBgmMuted(): boolean {
    return this.isBgmMuted;
  }

  public setBgmVolume(volume: number) {
    this.bgmVolume = Math.max(0, Math.min(1, volume));
    if (this.bgmAudio) {
      this.bgmAudio.volume = this.bgmVolume;
    }
  }

  public pauseBgm() {
    this.bgmAudio?.pause();
  }

  public resumeBgm() {
    if (!this.isBgmMuted) {
      this.attemptPlayBgm();
    }
  }

  // --- Sound Effects (SFX) Methods ---
  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('pyduel_muted', String(this.isMuted));
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  // 1. Correct Answer Chime (Bright 2-tone melodic harmonic)
  public playCorrect() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    // Note 1: C5 (523.25 Hz)
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, now);
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.25);

    // Note 2: G5 (783.99 Hz)
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(783.99, now + 0.12);
    gain2.gain.setValueAtTime(0.2, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.5);
  }

  // 2. Wrong Answer Buzzer (Dissonant low buzzer)
  public playWrong() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(145, now);
    osc.frequency.linearRampToValueAtTime(95, now + 0.35);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  // 3. Tick Timer (Subtle percussive woodblock click)
  public playTick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(950, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  // 4. Power-up Woosh (Rising resonance filter sweep)
  public playPowerup() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.3);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  // 5. Shield Absorb Sound
  public playShield() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.linearRampToValueAtTime(660, now + 0.15);
    osc.frequency.linearRampToValueAtTime(330, now + 0.35);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  // 6. Victory Fanfare (Triumphant arpeggio: C5 -> E5 -> G5 -> C6)
  public playVictory() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50];
    const startTime = this.ctx.currentTime;

    notes.forEach((freq, index) => {
      if (!this.ctx) return;
      const noteStart = startTime + index * 0.14;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = index === notes.length - 1 ? 'square' : 'triangle';
      osc.frequency.setValueAtTime(freq, noteStart);

      const duration = index === notes.length - 1 ? 0.6 : 0.2;
      gain.gain.setValueAtTime(0.18, noteStart);
      gain.gain.exponentialRampToValueAtTime(0.001, noteStart + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(noteStart);
      osc.stop(noteStart + duration);
    });
  }

  // 7. Defeat Theme (Descending melancholic notes)
  public playDefeat() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [440, 392, 349.23, 261.63];
    const startTime = this.ctx.currentTime;

    notes.forEach((freq, index) => {
      if (!this.ctx) return;
      const noteStart = startTime + index * 0.2;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, noteStart);

      gain.gain.setValueAtTime(0.12, noteStart);
      gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(noteStart);
      osc.stop(noteStart + 0.28);
    });
  }
}

export const soundEngine = new SoundEngine();

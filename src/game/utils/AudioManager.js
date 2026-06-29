class AudioManager {
  constructor() {
    this.context = null;
    this.enabled = localStorage.getItem('mathchase-sound-enabled') !== 'false';
    this.musicEnabled = localStorage.getItem('mathchase-music-enabled') !== 'false';
    this.masterVolume = 0.5;
    this.currentMusic = null;
  }

  initContext() {
    if (!this.context) {
      this.context = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.context.state === 'suspended') {
      this.context.resume();
    }
  }

  toggleSound(enabled) {
    this.enabled = enabled;
    localStorage.setItem('mathchase-sound-enabled', enabled);
  }

  toggleMusic(enabled) {
    this.musicEnabled = enabled;
    localStorage.setItem('mathchase-music-enabled', enabled);
    if (!enabled && this.currentMusic) {
      this.currentMusic.stop();
    } else if (enabled && this.currentMusic) {
      this.currentMusic.start();
    }
  }

  playTone(freq, type, duration, volume = 0.1) {
    if (!this.enabled) return;
    this.initContext();

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.context.currentTime);

    gain.gain.setValueAtTime(volume * this.masterVolume, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.context.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.context.destination);

    osc.start();
    osc.stop(this.context.currentTime + duration);
  }

  playCoin() {
    this.playTone(800, 'sine', 0.1, 0.1);
    setTimeout(() => this.playTone(1200, 'sine', 0.1, 0.1), 50);
  }

  playWrong() {
    this.playTone(200, 'sawtooth', 0.3, 0.1);
    setTimeout(() => this.playTone(150, 'sawtooth', 0.4, 0.1), 100);
  }

  playCorrect() {
    this.playTone(600, 'sine', 0.1, 0.1);
    setTimeout(() => this.playTone(900, 'sine', 0.2, 0.1), 100);
  }

  playGhost() {
    this.playTone(100, 'square', 0.5, 0.1);
  }

  playGameOver() {
    const notes = [400, 300, 200, 150];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'sawtooth', 0.5, 0.1), i * 300);
    });
  }

  playVictory() {
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'sine', 0.4, 0.1), i * 200);
    });
  }

  playClick() {
    this.playTone(400, 'sine', 0.05, 0.05);
  }

  startMusic() {
    if (!this.musicEnabled || this.currentMusic) return;

    // Simple bass loop for music
    const playBar = () => {
      if (!this.musicEnabled) return;

      const notes = [110, 110, 164.81, 110, 110, 110, 146.83, 138.59];
      notes.forEach((freq, i) => {
        setTimeout(() => {
          if (this.musicEnabled) this.playTone(freq, 'triangle', 0.3, 0.05);
        }, i * 250);
      });

      this.musicTimer = setTimeout(playBar, 2000);
    };

    playBar();
    this.currentMusic = {
      stop: () => {
        clearTimeout(this.musicTimer);
        this.currentMusic = null;
      },
      start: () => playBar()
    };
  }
}

const audioManager = new AudioManager();
export default audioManager;

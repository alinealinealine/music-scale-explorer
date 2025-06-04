export type PlayMode = 'ascending' | 'descending' | 'both';

export class AudioEngine {
  private audioContext: AudioContext | null = null;
  private isPlaying = false;
  private currentGain: GainNode | null = null;

  constructor() {
    this.initializeAudioContext();
  }

  private initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.error('Web Audio API is not supported in this browser:', error);
    }
  }

  async ensureAudioContext() {
    if (!this.audioContext) {
      this.initializeAudioContext();
    }

    if (this.audioContext?.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  async playNote(frequency: number, duration: number = 0.5, volume: number = 0.3): Promise<void> {
    await this.ensureAudioContext();
    
    if (!this.audioContext) {
      console.error('Audio context not available');
      return;
    }

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.type = 'sine';

    // Envelope for smooth attack and decay
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);

    return new Promise(resolve => {
      oscillator.onended = () => resolve();
    });
  }

  async playScale(
    frequencies: number[], 
    tempo: number = 120, 
    volume: number = 0.3, 
    mode: PlayMode = 'ascending'
  ): Promise<void> {
    if (this.isPlaying) {
      this.stopScale();
      return;
    }

    this.isPlaying = true;
    const noteDuration = 60 / tempo; // Duration in seconds based on BPM
    
    try {
      let notesToPlay = [...frequencies];
      
      if (mode === 'descending') {
        notesToPlay = [...frequencies].reverse();
      } else if (mode === 'both') {
        notesToPlay = [...frequencies, ...frequencies.slice().reverse().slice(1)];
      }

      for (let i = 0; i < notesToPlay.length && this.isPlaying; i++) {
        await this.playNote(notesToPlay[i], noteDuration * 0.8, volume);
        
        if (i < notesToPlay.length - 1 && this.isPlaying) {
          await this.delay(noteDuration * 0.2 * 1000); // Small gap between notes
        }
      }
    } finally {
      this.isPlaying = false;
    }
  }

  stopScale(): void {
    this.isPlaying = false;
    
    if (this.audioContext) {
      // Stop all current audio
      const currentTime = this.audioContext.currentTime;
      if (this.currentGain) {
        this.currentGain.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.1);
      }
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }

  dispose(): void {
    this.stopScale();
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
  }
}

// Global audio engine instance
export const audioEngine = new AudioEngine();

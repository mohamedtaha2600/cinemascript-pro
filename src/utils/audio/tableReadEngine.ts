import { ScriptBlock } from '@/src/types';
import { VoiceCharacterMapping } from '@/src/types/audioTypes';

export class TableReadAudioEngine {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private rate: number = 1.0;
  private volume: number = 1.0;
  private characterVoices: Map<string, VoiceCharacterMapping> = new Map();

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (this.synth) {
      this.voices = this.synth.getVoices();
    }
  }

  public setRate(rate: number) {
    this.rate = rate;
  }

  public setVolume(volume: number) {
    this.volume = volume;
  }

  public speakBlock(block: ScriptBlock, onEnd?: () => void) {
    if (!this.synth || !block.text.trim()) {
      onEnd?.();
      return;
    }

    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(block.text);
    utterance.rate = this.rate;
    utterance.volume = this.volume;

    if (block.type === 'character' || block.type === 'dialogue') {
      const charVoice = this.characterVoices.get(block.text.trim().toUpperCase());
      if (charVoice) {
        utterance.pitch = charVoice.pitch;
        utterance.rate = charVoice.rate * this.rate;
      } else {
        utterance.pitch = block.type === 'character' ? 1.1 : 1.0;
      }
    } else {
      // Narrator Voice
      utterance.pitch = 0.9;
    }

    utterance.onend = () => onEnd?.();
    utterance.onerror = () => onEnd?.();

    this.synth.speak(utterance);
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

export const globalTableReadEngine = new TableReadAudioEngine();

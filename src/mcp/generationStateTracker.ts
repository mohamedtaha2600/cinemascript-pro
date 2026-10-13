import { GenerationProgress } from './types/seriesTypes';

const STORAGE_KEY = 'cinemascript_generation_progress_v1';

export class GenerationStateTracker {
  private progress: GenerationProgress = {
    status: 'idle',
    currentEpisode: 0,
    totalEpisodes: 30,
    currentScene: 0,
    totalScenesWritten: 0,
    totalPagesGenerated: 0,
    activeTaskMessage: 'Ready for autonomous series generation',
  };

  constructor() {
    this.loadFromStorage();
  }

  public getProgress(): GenerationProgress {
    return { ...this.progress };
  }

  public updateProgress(updates: Partial<GenerationProgress>) {
    this.progress = { ...this.progress, ...updates };
    this.saveToStorage();
  }

  public reset() {
    this.progress = {
      status: 'idle',
      currentEpisode: 0,
      totalEpisodes: 30,
      currentScene: 0,
      totalScenesWritten: 0,
      totalPagesGenerated: 0,
      activeTaskMessage: 'Idle',
    };
    this.saveToStorage();
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.progress));
    } catch {
      // Local storage fallback
    }
  }

  private loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        this.progress = JSON.parse(raw);
      }
    } catch {
      // Fallback
    }
  }
}

export const globalStateTracker = new GenerationStateTracker();

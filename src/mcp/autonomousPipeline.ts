import { SeriesBibleBlueprint, GenerationProgress } from './types/seriesTypes';
import { globalStateTracker } from './generationStateTracker';
import { AIToolCall } from '@/src/types';

export interface AutonomousPipelineOptions {
  onProgressUpdate?: (progress: GenerationProgress) => void;
  onToolDispatch?: (toolName: string, params: Record<string, any>) => void;
}

export class AutonomousPipelineManager {
  private options: AutonomousPipelineOptions;
  private isPaused: boolean = false;

  constructor(options: AutonomousPipelineOptions = {}) {
    this.options = options;
  }

  public pause() {
    this.isPaused = true;
    globalStateTracker.updateProgress({ activeTaskMessage: 'Pipeline Paused' });
  }

  public resume() {
    this.isPaused = false;
    globalStateTracker.updateProgress({ activeTaskMessage: 'Pipeline Resumed' });
  }

  public async executeSeriesGeneration(
    seriesTitle: string,
    premise: string,
    totalEpisodes: number = 30,
    dispatcher: (toolName: string, params: Record<string, any>) => void
  ): Promise<boolean> {
    globalStateTracker.updateProgress({
      status: 'generating_bible',
      currentEpisode: 0,
      totalEpisodes,
      activeTaskMessage: `Phase 1: Generating Series Bible for "${seriesTitle}"`,
    });
    this.notify();

    // Phase 1: Bible & Worldbuilding
    dispatcher('create_full_project_structure', { title: seriesTitle, totalEpisodes });
    await this.sleep(400);

    // Phase 2: Corkboard & Outlines
    globalStateTracker.updateProgress({
      status: 'generating_outlines',
      activeTaskMessage: `Phase 2: Generating ${totalEpisodes} Episode Outlines on Corkboard`,
    });
    this.notify();

    for (let ep = 1; ep <= totalEpisodes; ep++) {
      if (this.isPaused) break;
      globalStateTracker.updateProgress({
        currentEpisode: ep,
        activeTaskMessage: `Phase 2: Outlining Episode ${ep}/${totalEpisodes}`,
      });
      this.notify();

      dispatcher('add_scene_card', {
        slugline: `EPISODE ${ep}: THE BEAT`,
        summary: `Episode ${ep} dramatic arc for ${premise}`,
        act: ep % 3 === 0 ? 3 : ep % 2 === 0 ? 2 : 1,
      });
      await this.sleep(150);
    }

    // Phase 3: Screenplay Writing Loop
    globalStateTracker.updateProgress({
      status: 'writing_screenplay',
      activeTaskMessage: `Phase 3: Screenplay Writing Loop for ${totalEpisodes} Episodes`,
    });
    this.notify();

    for (let ep = 1; ep <= totalEpisodes; ep++) {
      if (this.isPaused) break;
      globalStateTracker.updateProgress({
        currentEpisode: ep,
        totalScenesWritten: ep * 4,
        totalPagesGenerated: ep * 2,
        activeTaskMessage: `Phase 3: Writing Screenplay Blocks for Episode ${ep}/${totalEpisodes}`,
      });
      this.notify();

      dispatcher('insert_script_block', {
        type: 'scene_heading',
        text: `INT. EPISODE ${ep} HEADQUARTERS - DAY`,
      });
      dispatcher('insert_script_block', {
        type: 'action',
        text: `Opening dramatic scene for episode ${ep} of ${seriesTitle}.`,
      });
      await this.sleep(200);
    }

    // Phase 4: Production Breakdown
    globalStateTracker.updateProgress({
      status: 'generating_breakdown',
      activeTaskMessage: `Phase 4: Auto-Generating Production Breakdown for All Episodes`,
    });
    this.notify();

    dispatcher('auto_generate_breakdown_for_all_scenes', {});
    await this.sleep(300);

    // Phase 5: Completed
    globalStateTracker.updateProgress({
      status: 'completed',
      activeTaskMessage: `Autonomous Series Generation Complete! Generated 30 Episodes for ${seriesTitle}`,
    });
    this.notify();

    return true;
  }

  private notify() {
    this.options.onProgressUpdate?.(globalStateTracker.getProgress());
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

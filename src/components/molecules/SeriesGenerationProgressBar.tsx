import React from 'react';
import { GenerationProgress } from '@/src/mcp/types/seriesTypes';
import { Film, CheckCircle2, Pause, Play, Loader2 } from 'lucide-react';
import { Button, Badge } from '@/src/components/atoms';

export interface SeriesGenerationProgressBarProps {
  progress: GenerationProgress;
  onPauseToggle?: () => void;
  onClose?: () => void;
}

export const SeriesGenerationProgressBar: React.FC<SeriesGenerationProgressBarProps> = ({
  progress,
  onPauseToggle,
}) => {
  if (progress.status === 'idle') return null;

  const percent = Math.min(
    100,
    Math.round((progress.currentEpisode / Math.max(1, progress.totalEpisodes)) * 100)
  );

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 flex w-[90%] max-w-2xl items-center justify-between rounded-2xl bg-[#0f1015]/95 p-4 border border-amber-500/40 shadow-2xl backdrop-blur-2xl font-mono text-xs text-slate-100 select-none animate-pulse">
      <div className="flex items-center space-x-3 overflow-hidden">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
          {progress.status === 'completed' ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          ) : (
            <Loader2 className="h-5 w-5 animate-spin" />
          )}
        </div>
        <div className="overflow-hidden">
          <div className="flex items-center space-x-2">
            <Badge variant="primary">30-EPISODE GENERATOR</Badge>
            <span className="font-bold text-amber-400">{percent}%</span>
          </div>
          <p className="text-[11px] text-slate-400 truncate mt-0.5">{progress.activeTaskMessage}</p>
        </div>
      </div>

      <div className="flex items-center space-x-3 shrink-0">
        <div className="hidden sm:block w-32 h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>

        {onPauseToggle && progress.status !== 'completed' && (
          <Button variant="outline" size="sm" onClick={onPauseToggle}>
            <Pause className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { ToneAnalysisResult } from '@/src/utils/ai/dialogueToneAnalyzer';
import { Clapperboard, Flame, MessageSquare } from 'lucide-react';
import { Badge } from '@/src/components/atoms';

export interface AiDirectorFeedbackWidgetProps {
  analysis: ToneAnalysisResult;
}

export const AiDirectorFeedbackWidget: React.FC<AiDirectorFeedbackWidgetProps> = ({ analysis }) => {
  return (
    <div className="rounded-xl bg-[#0f1015]/90 p-4 border border-amber-500/30 backdrop-blur-xl font-mono text-xs text-slate-200 space-y-2.5 shadow-xl select-none">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <span className="flex items-center space-x-2 font-bold text-amber-400">
          <Clapperboard className="h-4 w-4" />
          <span>AI SCRIPT DIRECTOR</span>
        </span>
        <Badge variant="primary">TENSION: {analysis.tensionScore}%</Badge>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center space-x-1">
          <Flame className="h-3.5 w-3.5 text-orange-400" />
          <span>EMOTION: <strong className="text-slate-100">{analysis.dominantEmotion}</strong></span>
        </span>
        <span className="flex items-center space-x-1 text-cyan-400">
          <MessageSquare className="h-3.5 w-3.5" />
          <span>SUBTEXT ACTIVE</span>
        </span>
      </div>

      <p className="text-[11px] text-slate-300 italic border-t border-slate-800/60 pt-2">
        "{analysis.subtextHint}"
      </p>
    </div>
  );
};

import React from 'react';
import { useTranslation } from '@/src/hooks/useTranslation';
import { useProject } from '@/src/context/ProjectContext';
import { Plus, BookOpen, FileText, Flame, Target } from 'lucide-react';
import { Button } from '@/src/components/atoms';

export interface WriterStatsWidgetProps {
  onNewProject: () => void;
}

export const WriterStatsWidget: React.FC<WriterStatsWidgetProps> = ({ onNewProject }) => {
  const { projects } = useProject();
  const { t, language } = useTranslation();

  const totalPages = projects.reduce((acc, p) => acc + (p.pages || 0), 0);
  const totalWords = projects.reduce((acc, p) => acc + (p.words || 0), 0);
  const activeProjectsCount = projects.length;
  const weeklyGoalPercent = activeProjectsCount > 0 ? Math.min(100, Math.round((totalPages / 30) * 100)) : 0;

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col space-y-4 select-none">
      <Button variant="primary" size="lg" className="w-full shadow-lg shadow-amber-500/20" onClick={onNewProject}>
        <Plus className="h-4 w-4" />
        <span>{t('newProject')}</span>
      </Button>

      <div className="rounded-xl bg-[#0f1015]/80 p-5 border border-slate-800/80 backdrop-blur-xl space-y-4">
        <div className="flex items-center space-x-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-widest border-b border-slate-800 pb-3">
          <Target className="h-4 w-4" />
          <span>{t('writerStats')}</span>
        </div>

        <div className="space-y-3 text-xs font-mono">
          <div className="flex justify-between items-center text-slate-300">
            <span className="flex items-center space-x-2 text-slate-400">
              <FileText className="h-3.5 w-3.5 text-amber-400" />
              <span>{t('totalPages')}</span>
            </span>
            <span className="font-bold text-slate-100">{totalPages.toLocaleString()}</span>
          </div>

          <div className="flex justify-between items-center text-slate-300">
            <span className="flex items-center space-x-2 text-slate-400">
              <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
              <span>{t('words')}</span>
            </span>
            <span className="font-bold text-slate-100">{totalWords.toLocaleString()}</span>
          </div>

          <div className="flex justify-between items-center text-slate-300">
            <span className="flex items-center space-x-2 text-slate-400">
              <Flame className="h-3.5 w-3.5 text-orange-400" />
              <span>{language === 'ar' ? 'المشاريع النشطة' : 'Active Projects'}</span>
            </span>
            <span className="font-bold text-amber-400">{activeProjectsCount}</span>
          </div>

          <div className="pt-2 space-y-1.5">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>{t('weeklyGoal')}</span>
              <span className="font-bold text-amber-400">{weeklyGoalPercent}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-900 overflow-hidden border border-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500 shadow-sm"
                style={{ width: `${weeklyGoalPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

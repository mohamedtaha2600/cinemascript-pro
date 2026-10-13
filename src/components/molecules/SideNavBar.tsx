import React from 'react';
import { useProject } from '@/src/context/ProjectContext';
import { useTranslation } from '@/src/hooks/useTranslation';
import { ViewMode } from '@/src/types';
import {
  FileText,
  Kanban,
  Table,
  BookOpen,
  Users,
  History,
  Plus,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/src/components/atoms';

export const SideNavBar: React.FC = () => {
  const { currentProject, activeView, setActiveView, setIsNewSceneOpen, setIsSettingsOpen } = useProject();
  const { t, isRtl, language } = useTranslation();

  const navItems: { id: ViewMode; labelKey: 'sceneTree' | 'outliner' | 'breakdown' | 'bible' | 'characters' | 'revisions'; icon: any }[] = [
    { id: 'editor', labelKey: 'sceneTree', icon: FileText },
    { id: 'outliner', labelKey: 'outliner', icon: Kanban },
    { id: 'breakdown', labelKey: 'breakdown', icon: Table },
    { id: 'bible', labelKey: 'bible', icon: BookOpen },
    { id: 'characters', labelKey: 'characters', icon: Users },
    { id: 'revisions', labelKey: 'revisions', icon: History },
  ];

  const projectTitle = currentProject.title || (language === 'ar' ? 'بدون عنوان' : 'Untitled');
  const projectSubtitle = currentProject.subtitle || (language === 'ar' ? 'مسودة جديدة' : 'New Draft');
  const avatarLetter = (currentProject.title ? currentProject.title.slice(0, 2) : 'CS').toUpperCase();

  return (
    <aside
      className={`flex h-full w-64 shrink-0 flex-col bg-[#07080a] ${
        isRtl ? 'border-l' : 'border-r'
      } border-slate-800/80 z-40 select-none`}
    >
      <div className="p-4 border-b border-slate-800/80 space-y-3">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 text-amber-400 font-mono font-bold text-sm shadow-md">
            {avatarLetter}
          </div>
          <div className="overflow-hidden">
            <h2 className="text-slate-100 font-bold text-xs truncate leading-snug">{projectTitle}</h2>
            <p className="text-slate-400 text-[10px] font-mono truncate">{projectSubtitle}</p>
          </div>
        </div>

        <Button variant="primary" size="sm" className="w-full" onClick={() => setIsNewSceneOpen(true)}>
          <Plus className="h-3.5 w-3.5" />
          <span>{t('newScene')}</span>
        </Button>
      </div>

      <nav className="flex-1 space-y-1 p-2 font-mono text-xs">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex w-full items-center space-x-3 rounded-lg px-3 py-2.5 transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-500/10 text-amber-400 font-bold border border-amber-500/30 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <IconComponent className={`h-4 w-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
              <span>{t(item.labelKey)}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-800/80 space-y-1 font-mono text-xs">
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition-all cursor-pointer"
        >
          <Settings className="h-4 w-4 text-slate-500" />
          <span>{t('settings')}</span>
        </button>
        <button
          onClick={() => setActiveView('revisions')}
          className="flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition-all cursor-pointer"
        >
          <HelpCircle className="h-4 w-4 text-slate-500" />
          <span>{t('support')}</span>
        </button>
      </div>
    </aside>
  );
};

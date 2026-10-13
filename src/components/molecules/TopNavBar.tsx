import React from 'react';
import { useProject } from '@/src/context/ProjectContext';
import { useTranslation } from '@/src/hooks/useTranslation';
import { Search, Download, Settings, Globe } from 'lucide-react';
import { Button } from '@/src/components/atoms';
import { GoogleAuthButton } from './GoogleAuthButton';

export const TopNavBar: React.FC = () => {
  const { activeView, setActiveView, searchQuery, setSearchQuery, setIsExportOpen, setIsSettingsOpen } = useProject();
  const { t, language, toggleLanguage } = useTranslation();

  return (
    <header className="sticky top-0 z-50 flex h-14 w-full shrink-0 items-center justify-between border-b border-slate-800/80 bg-[#0a0a0c]/80 px-4 sm:px-6 backdrop-blur-xl transition-all font-sans select-none">
      <div className="flex items-center space-x-6 rtl:space-x-reverse">
        <div
          onClick={() => setActiveView('projects')}
          className="flex cursor-pointer items-center space-x-3 rtl:space-x-reverse group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-black font-black text-lg shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-all">
            C
          </div>
          <span className="font-sans font-extrabold text-lg sm:text-xl text-slate-100 tracking-tight group-hover:text-amber-400 transition-colors">
            CinemaScript <span className="text-amber-400 text-xs font-mono font-bold tracking-widest uppercase">PRO</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center space-x-5 rtl:space-x-reverse text-xs font-mono font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveView('projects')}
            className={`pb-1 transition-all ${
              activeView === 'projects'
                ? 'border-b-2 border-amber-400 text-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t('projects')}
          </button>
          <button
            onClick={() => setActiveView('editor')}
            className={`pb-1 transition-all ${
              activeView !== 'projects' && activeView !== 'community'
                ? 'border-b-2 border-amber-400 text-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t('studio')}
          </button>
          <button
            onClick={() => setActiveView('community')}
            className={`pb-1 transition-all ${
              activeView === 'community'
                ? 'border-b-2 border-amber-400 text-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t('community')}
          </button>
        </nav>
      </div>

      <div className="flex items-center space-x-3 rtl:space-x-reverse">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-48 sm:w-60 rounded-lg bg-slate-900/90 pl-9 pr-3 py-1.5 text-xs font-mono text-slate-200 placeholder-slate-500 border border-slate-800 outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
          />
        </div>

        <button
          onClick={toggleLanguage}
          title={language === 'en' ? 'التبديل إلى العربية (RTL)' : 'Switch to English (LTR)'}
          className="flex items-center space-x-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-mono text-slate-300 hover:border-amber-500/40 hover:text-amber-400 transition-all cursor-pointer"
        >
          <Globe className="h-3.5 w-3.5 text-amber-400" />
          <span>{language === 'en' ? 'العربية' : 'English'}</span>
        </button>

        <GoogleAuthButton />

        <Button variant="primary" size="sm" onClick={() => setIsExportOpen(true)}>
          <Download className="h-3.5 w-3.5" />
          <span>{t('export')}</span>
        </Button>

        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-amber-400 hover:border-amber-500/40 transition-all cursor-pointer"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
};

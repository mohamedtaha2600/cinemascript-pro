import React, { useState, useRef, useCallback } from 'react';
import { useProject } from '@/src/context/ProjectContext';
import { useTranslation } from '@/src/hooks/useTranslation';
import { useOnClickOutside } from '@/src/hooks/useOnClickOutside';
import { WriterStatsWidget } from '../molecules/WriterStatsWidget';
import { LayoutGrid, List, Plus, Film, MoreVertical, Trash2, Clock, FileText } from 'lucide-react';
import { Button, Badge } from '@/src/components/atoms';

export const ProjectsView: React.FC = () => {
  const {
    projects,
    setCurrentProjectId,
    setActiveView,
    setIsNewProjectOpen,
    deleteProject,
    googleUser,
    cloudSyncStatus,
    syncProjectsToCloud,
    loginWithGoogle,
  } = useProject();

  const { t, language } = useTranslation();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleCloseMenu = useCallback(() => {
    setActiveMenuId(null);
  }, []);

  useOnClickOutside(menuRef, handleCloseMenu, Boolean(activeMenuId));

  const handleOpenProject = (id: string) => {
    setCurrentProjectId(id);
    setActiveView('editor');
  };

  return (
    <div className="flex-1 flex px-6 md:px-12 py-8 gap-8 w-full max-w-[1440px] mx-auto overflow-y-auto pb-16 select-none font-sans">
      <div className="w-80 shrink-0 space-y-6 hidden lg:block">
        <WriterStatsWidget onNewProject={() => setIsNewProjectOpen(true)} />

        <div className="rounded-2xl bg-[#0f1015]/90 p-5 border border-slate-800 space-y-3 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200">
              {language === 'ar' ? 'سحابة Google Drive' : 'Google Drive Cloud'}
            </span>
            <span className="flex h-2.5 w-2.5 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${googleUser ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${googleUser ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            </span>
          </div>

          {googleUser ? (
            <div className="space-y-2 font-mono text-[11px]">
              <p className="text-slate-400">
                {language === 'ar' ? 'المستخدم:' : 'User:'} <strong className="text-slate-200 font-sans">{googleUser.name}</strong>
              </p>
              <p className="text-slate-400">
                {language === 'ar' ? 'المشاريع المُزامنة:' : 'Synced Files:'} <strong className="text-amber-400">{cloudSyncStatus.syncedProjectsCount || projects.length}</strong>
              </p>
              <p className="text-slate-500 text-[10px]">
                {language === 'ar' ? 'آخر مزامنة:' : 'Last backup:'} {cloudSyncStatus.lastSyncTimestamp || (language === 'ar' ? 'مزامنة نشطة' : 'Active')}
              </p>

              <Button variant="outline" size="sm" onClick={syncProjectsToCloud} disabled={cloudSyncStatus.isSyncing} className="w-full mt-2 text-xs">
                {cloudSyncStatus.isSyncing
                  ? (language === 'ar' ? 'جاري رفع الملفات...' : 'Uploading...')
                  : (language === 'ar' ? 'مزامنة الآن إلى Drive' : 'Sync to Drive Now')}
              </Button>
            </div>
          ) : (
            <div className="space-y-2 text-xs">
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {language === 'ar'
                  ? 'قم بتسجيل الدخول بحساب Google الخاص بك لتفعيل النسخ الاحتياطي والمزامنة السحابية الآمنة 100%.'
                  : 'Sign in with Google to enable 100% private cloud backup & cross-device sync.'}
              </p>
              <Button variant="primary" size="sm" onClick={loginWithGoogle} className="w-full mt-1">
                {language === 'ar' ? 'ربط بحساب Google' : 'Connect Google Drive'}
              </Button>
            </div>
          )}
        </div>
      </div>

      <main className="flex-1 flex flex-col space-y-6">
        <div className="flex justify-between items-end border-b border-slate-800 pb-4">
          <div>
            <h1 className="font-sans text-3xl font-extrabold text-slate-100 tracking-tight">{t('projects')}</h1>
            <p className="font-mono text-xs text-slate-400 uppercase tracking-wider mt-1">
              {projects.length > 0 ? t('recentDrafts') : (language === 'ar' ? 'لا توجد مشاريع حالياً' : 'No active projects')}
            </p>
          </div>

          <div className="flex space-x-2 rtl:space-x-reverse">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg border transition-all ${
                viewMode === 'grid'
                  ? 'border-amber-500/50 bg-amber-500/10 text-amber-400'
                  : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg border transition-all ${
                viewMode === 'list'
                  ? 'border-amber-500/50 bg-amber-500/10 text-amber-400'
                  : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 p-12 flex flex-col items-center justify-center text-center my-6 bg-[#0f1015]/50 backdrop-blur-xl">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-5 shadow-lg shadow-amber-500/10">
              <Film className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">
              {language === 'ar' ? 'مساحة العمل نظيفة تماماً ومستعدة' : 'Your workspace is ready for action'}
            </h3>
            <p className="font-mono text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
              {language === 'ar'
                ? 'ابدأ مشروعك السينمائي الجديد وكتابة السيناريو وفق أفضل المعايير الاحترافية.'
                : 'Start fresh with your screenplay and experience modern Hollywood layout tools.'}
            </p>
            <Button variant="primary" size="lg" onClick={() => setIsNewProjectOpen(true)}>
              <Plus className="h-4 w-4" />
              <span>{t('startNewDraft')}</span>
            </Button>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'flex flex-col space-y-4'}>
            {projects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => handleOpenProject(proj.id)}
                className="group relative rounded-2xl bg-[#0f1015]/80 p-6 border border-slate-800/80 hover:border-amber-500/40 hover:bg-slate-900/60 transition-all duration-300 cursor-pointer shadow-xl backdrop-blur-xl space-y-4 overflow-hidden"
              >
                <div className="flex justify-between items-start">
                  <Badge variant="primary">{proj.badge}</Badge>

                  <div className="relative" ref={activeMenuId === proj.id ? menuRef : undefined}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(activeMenuId === proj.id ? null : proj.id);
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>

                    {activeMenuId === proj.id && (
                      <div className="absolute right-0 top-7 z-20 w-36 rounded-xl bg-slate-950 p-1 border border-slate-800 shadow-2xl">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteProject(proj.id);
                            setActiveMenuId(null);
                          }}
                          className="flex w-full items-center space-x-2 rtl:space-x-reverse rounded-lg px-3 py-2 text-xs font-mono text-rose-400 hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>{language === 'ar' ? 'حذف المشروع' : 'Delete Project'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-100 text-lg group-hover:text-amber-400 transition-colors line-clamp-1">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-1 line-clamp-1">{proj.subtitle}</p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-800/60 pt-4 text-[11px] font-mono text-slate-400">
                  <span className="flex items-center space-x-1.5 rtl:space-x-reverse">
                    <FileText className="h-3.5 w-3.5 text-amber-400" />
                    <span>{proj.pages} {t('pages')}</span>
                  </span>
                  <span className="flex items-center space-x-1.5 rtl:space-x-reverse text-slate-500">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{language === 'ar' ? 'مسودة نشطة' : 'Active Draft'}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

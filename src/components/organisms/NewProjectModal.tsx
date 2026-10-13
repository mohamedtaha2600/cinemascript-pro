import React, { useState, useEffect, useCallback } from 'react';
import { useProject } from '@/src/context/ProjectContext';
import { useTranslation } from '@/src/hooks/useTranslation';
import { X, Film } from 'lucide-react';
import { Button } from '@/src/components/atoms';
import { NewProjectForm } from './newProject/NewProjectForm';

export const NewProjectModal: React.FC = () => {
  const { isNewProjectOpen, setIsNewProjectOpen, createNewProject } = useProject();
  const { t, language } = useTranslation();
  const [title, setTitle] = useState(language === 'ar' ? 'سيناريو جديد' : 'UNTITLED SCREENPLAY');
  const [format, setFormat] = useState<'Feature Film' | 'Television Series'>('Feature Film');
  const [acts, setActs] = useState<number>(3);
  const [targetPages, setTargetPages] = useState(110);

  const handleClose = useCallback(() => {
    setIsNewProjectOpen(false);
  }, [setIsNewProjectOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isNewProjectOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isNewProjectOpen, handleClose]);

  if (!isNewProjectOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createNewProject({
      title,
      subtitle: language === 'ar' ? 'المسودة الأولى V1' : 'V1 Production Draft',
      formatType: format,
      actStructure: acts,
      targetPages,
    });
  };

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 select-none font-sans"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl rounded-2xl bg-[#0f1015] p-6 border border-amber-500/30 shadow-2xl space-y-6"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Film className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-lg">{t('newProjectSetup')}</h3>
              <p className="text-xs text-slate-400 font-mono">
                {language === 'ar' ? 'تهيئة الهيكل الدرامي والبيانات الأساسية' : 'Configure narrative structure & script metadata'}
              </p>
            </div>
          </div>
          <button onClick={handleClose} className="text-slate-400 hover:text-white p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <NewProjectForm
            title={title}
            format={format}
            acts={acts}
            targetPages={targetPages}
            onTitleChange={setTitle}
            onFormatChange={setFormat}
            onActsChange={setActs}
            onTargetPagesChange={setTargetPages}
          />

          <div className="flex items-center justify-end space-x-3 rtl:space-x-reverse border-t border-slate-800 pt-4">
            <Button variant="outline" type="button" onClick={handleClose}>
              {t('cancel')}
            </Button>
            <Button variant="primary" type="submit">
              {t('initializeProject')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

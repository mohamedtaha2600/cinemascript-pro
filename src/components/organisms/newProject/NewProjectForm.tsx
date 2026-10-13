import React from 'react';
import { useTranslation } from '@/src/hooks/useTranslation';
import { Film, Tv } from 'lucide-react';

export interface NewProjectFormProps {
  title: string;
  format: 'Feature Film' | 'Television Series';
  acts: number;
  targetPages: number;
  onTitleChange: (v: string) => void;
  onFormatChange: (v: 'Feature Film' | 'Television Series') => void;
  onActsChange: (v: number) => void;
  onTargetPagesChange: (v: number) => void;
}

export const NewProjectForm: React.FC<NewProjectFormProps> = ({
  title,
  format,
  acts,
  targetPages,
  onTitleChange,
  onFormatChange,
  onActsChange,
  onTargetPagesChange,
}) => {
  const { t, language } = useTranslation();

  return (
    <div className="space-y-4 font-sans select-none">
      <div>
        <label className="block text-xs font-bold text-amber-400 uppercase mb-1">{t('workingTitle')}</label>
        <input
          type="text"
          autoFocus
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder={language === 'ar' ? 'عنوان المشروع' : 'Untitled Screenplay'}
          className="w-full rounded bg-slate-900 px-4 py-3 text-lg font-bold text-slate-100 border border-slate-800 outline-none focus:border-amber-500/50"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-amber-400 uppercase mb-2">{t('narrativeArchitecture')}</label>
        <div className="grid grid-cols-2 gap-3">
          <div
            onClick={() => { onFormatChange('Feature Film'); onTargetPagesChange(110); }}
            className={`flex items-center space-x-3 rtl:space-x-reverse rounded-lg p-3 cursor-pointer border transition-all ${
              format === 'Feature Film' ? 'bg-amber-500/10 border-amber-500 text-slate-100' : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <Film className="h-5 w-5 text-amber-400" />
            <div>
              <h4 className="font-bold text-sm">{t('featureFilm')}</h4>
              <p className="text-[10px] text-slate-500">{t('targetPagesFeature')}</p>
            </div>
          </div>

          <div
            onClick={() => { onFormatChange('Television Series'); onTargetPagesChange(60); }}
            className={`flex items-center space-x-3 rtl:space-x-reverse rounded-lg p-3 cursor-pointer border transition-all ${
              format === 'Television Series' ? 'bg-blue-500/10 border-blue-500 text-slate-100' : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <Tv className="h-5 w-5 text-blue-400" />
            <div>
              <h4 className="font-bold text-sm">{t('tvSeries')}</h4>
              <p className="text-[10px] text-slate-500">{t('targetPagesTv')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-2">
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">{t('actStructure')}</label>
          <div className="flex space-x-1.5 rtl:space-x-reverse overflow-x-auto pb-1">
            {[1, 2, 3, 4, 5].map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => onActsChange(a)}
                className={`flex-1 py-1.5 px-2 rounded text-xs font-mono font-bold border transition-colors ${
                  acts === a ? 'bg-amber-500 text-black border-amber-500' : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                {a} {language === 'ar' ? 'فصل' : 'Act'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">{t('targetLengthPages')}</label>
          <input
            type="number"
            value={targetPages}
            onChange={(e) => onTargetPagesChange(parseInt(e.target.value, 10) || 110)}
            className="w-full rounded bg-slate-900 px-3 py-2 text-xs font-mono text-slate-100 border border-slate-800 outline-none"
          />
        </div>
      </div>
    </div>
  );
};

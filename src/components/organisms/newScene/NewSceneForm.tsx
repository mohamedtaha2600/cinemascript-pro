import React from 'react';
import { useTranslation } from '@/src/hooks/useTranslation';

export interface NewSceneFormProps {
  setting: 'INT' | 'EXT' | 'INT/EXT';
  location: string;
  timeOfDay: 'DAY' | 'NIGHT' | 'CONTINUOUS' | 'LATER';
  summary: string;
  characters: string;
  onSettingChange: (v: 'INT' | 'EXT' | 'INT/EXT') => void;
  onLocationChange: (v: string) => void;
  onTimeOfDayChange: (v: 'DAY' | 'NIGHT' | 'CONTINUOUS' | 'LATER') => void;
  onSummaryChange: (v: string) => void;
  onCharactersChange: (v: string) => void;
}

export const NewSceneForm: React.FC<NewSceneFormProps> = ({
  setting,
  location,
  timeOfDay,
  summary,
  characters,
  onSettingChange,
  onLocationChange,
  onTimeOfDayChange,
  onSummaryChange,
  onCharactersChange,
}) => {
  const { t, language } = useTranslation();

  const todMap: Record<string, string> = {
    DAY: t('day'),
    NIGHT: t('night'),
    CONTINUOUS: t('continuous'),
    LATER: t('later'),
  };

  return (
    <div className="space-y-4 font-sans select-none">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-bold text-amber-400 uppercase mb-1">{t('intExt')}</label>
          <select
            value={setting}
            onChange={(e) => onSettingChange(e.target.value as any)}
            className="w-full rounded bg-slate-900 px-3 py-2 text-xs font-mono text-slate-100 border border-slate-800 outline-none"
          >
            <option value="INT">{language === 'ar' ? 'داخلي.' : 'INT.'}</option>
            <option value="EXT">{language === 'ar' ? 'خارجي.' : 'EXT.'}</option>
            <option value="INT/EXT">{language === 'ar' ? 'داخلي/خارجي.' : 'INT/EXT.'}</option>
          </select>
        </div>

        <div className="col-span-2">
          <label className="block text-xs font-bold text-amber-400 uppercase mb-1">{t('location')}</label>
          <input
            type="text"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            placeholder={language === 'ar' ? 'الموقع (مثال: الشارع الرئيسي)' : 'DOWNTOWN STREET'}
            className="w-full rounded bg-slate-900 px-3 py-2 text-xs font-mono text-slate-100 uppercase border border-slate-800 outline-none"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono text-slate-400 mb-1">{t('timeOfDay')}</label>
        <div className="grid grid-cols-4 gap-2">
          {(['DAY', 'NIGHT', 'CONTINUOUS', 'LATER'] as const).map((tod) => (
            <button
              key={tod}
              type="button"
              onClick={() => onTimeOfDayChange(tod)}
              className={`py-1.5 rounded text-[11px] font-mono font-bold border transition-colors ${
                timeOfDay === tod ? 'bg-amber-500 text-black border-amber-500' : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              {todMap[tod] || tod}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono text-slate-400 mb-1">{t('sceneSummary')}</label>
        <textarea
          rows={2}
          value={summary}
          onChange={(e) => onSummaryChange(e.target.value)}
          placeholder={language === 'ar' ? 'ملخص سريع للأحداث الدرامية في المشهد...' : 'Brief outline summary of dramatic beats...'}
          className="w-full rounded bg-slate-900 p-3 text-xs text-slate-100 border border-slate-800 outline-none resize-none"
        />
      </div>

      <div>
        <label className="block text-xs font-mono text-slate-400 mb-1">{t('charactersComma')}</label>
        <input
          type="text"
          value={characters}
          onChange={(e) => onCharactersChange(e.target.value)}
          placeholder={language === 'ar' ? 'أحمد، سارة' : 'JAX, MARA'}
          className="w-full rounded bg-slate-900 px-3 py-2 text-xs font-mono text-slate-100 uppercase border border-slate-800 outline-none"
        />
      </div>
    </div>
  );
};

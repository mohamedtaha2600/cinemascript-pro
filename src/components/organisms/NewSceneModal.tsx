import React, { useState, useEffect, useCallback } from 'react';
import { useProject } from '@/src/context/ProjectContext';
import { useTranslation } from '@/src/hooks/useTranslation';
import { X, Clapperboard } from 'lucide-react';
import { Button } from '@/src/components/atoms';
import { NewSceneForm } from './newScene/NewSceneForm';

export const NewSceneModal: React.FC = () => {
  const { isNewSceneOpen, setIsNewSceneOpen, addSceneCard, addBreakdownRow, addScriptBlock } = useProject();
  const { t, language } = useTranslation();
  const [setting, setSetting] = useState<'INT' | 'EXT' | 'INT/EXT'>('EXT');
  const [location, setLocation] = useState(language === 'ar' ? 'شارع المدينة الرئيسي' : 'DOWNTOWN ALLEY');
  const [timeOfDay, setTimeOfDay] = useState<'DAY' | 'NIGHT' | 'CONTINUOUS' | 'LATER'>('NIGHT');
  const [summary, setSummary] = useState(language === 'ar' ? 'يلتقي البطل بالطرف الآخر تحت غزارة المطر.' : 'Jax meets his contact in the pouring rain.');
  const [characters, setCharacters] = useState('JAX, MARA');

  const handleClose = useCallback(() => {
    setIsNewSceneOpen(false);
  }, [setIsNewSceneOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isNewSceneOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isNewSceneOpen, handleClose]);

  if (!isNewSceneOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slugline = `${setting}. ${location.toUpperCase()} - ${timeOfDay}`;

    addSceneCard({
      slugline,
      summary,
      pageCount: '1 Pg',
      colorTag: 'tag-blue',
      tagLabel: language === 'ar' ? 'الحبكة الرئيسية' : 'Main Plot',
      act: 1,
    });

    addBreakdownRow({
      setting,
      location: location.toUpperCase(),
      timeOfDay: timeOfDay as any,
      characters: characters.split(',').map((s) => s.trim().toUpperCase()),
      props: [],
      wardrobe: [],
      estPages: '1',
    });

    addScriptBlock({ type: 'scene_heading', text: slugline });
    addScriptBlock({ type: 'action', text: summary });

    setIsNewSceneOpen(false);
  };

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 select-none font-sans"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl bg-[#0f1015] p-6 border border-amber-500/30 shadow-2xl space-y-6"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clapperboard className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-lg">{t('createNewScene')}</h3>
              <p className="text-xs text-slate-400 font-mono">
                {language === 'ar' ? 'إضافة الترويسة والتفكيك والكتلة النصية' : 'Add slugline, breakdown & screenplay block'}
              </p>
            </div>
          </div>
          <button onClick={handleClose} className="text-slate-400 hover:text-white p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <NewSceneForm
            setting={setting}
            location={location}
            timeOfDay={timeOfDay}
            summary={summary}
            characters={characters}
            onSettingChange={setSetting}
            onLocationChange={setLocation}
            onTimeOfDayChange={setTimeOfDay}
            onSummaryChange={setSummary}
            onCharactersChange={setCharacters}
          />

          <div className="flex items-center justify-end space-x-3 rtl:space-x-reverse border-t border-slate-800 pt-4">
            <Button variant="outline" type="button" onClick={handleClose}>
              {t('cancel')}
            </Button>
            <Button variant="primary" type="submit">
              {t('addScene')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

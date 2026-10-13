import React, { useState, useEffect } from 'react';
import { useProject } from '@/src/context/ProjectContext';
import { useTranslation } from '@/src/hooks/useTranslation';
import { CardScene } from '../molecules/CardScene';
import { ZoomIn, ZoomOut, Plus, Filter, Kanban } from 'lucide-react';
import { Button, Badge } from '@/src/components/atoms';

export const OutlinerCorkboardView: React.FC = () => {
  const { currentProject, setIsNewSceneOpen, setIsNewProjectOpen, setActiveView, projects, addActToCurrentProject } = useProject();
  const { t, language } = useTranslation();
  const [selectedCardId, setSelectedCardId] = useState<string>(currentProject.cards[0]?.id || '');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [activeAct, setActiveAct] = useState<number>(1);

  const actCount = currentProject?.actStructure || 3;
  const actNumbers = Array.from({ length: Math.max(1, actCount) }, (_, i) => i + 1);

  const handleAddAct = () => {
    if (projects.length === 0 || !currentProject?.id || currentProject.id === 'blank-proj') {
      setIsNewProjectOpen(true);
      return;
    }
    addActToCurrentProject();
    setActiveAct(actCount + 1);
  };

  const handleAddCard = () => {
    if (projects.length === 0 || !currentProject?.id || currentProject.id === 'blank-proj') {
      setIsNewProjectOpen(true);
      return;
    }
    setIsNewSceneOpen(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedCardId('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(140, Math.max(70, prev + delta)));
  };

  const handleOpenSceneInEditor = (_card: typeof currentProject.cards[0]) => {
    setActiveView('editor');
  };

  const filteredCards = currentProject.cards.filter((c) => c.act === activeAct || !c.act);

  const actTitleMap: Record<number, string> = {
    1: t('act1Name'),
    2: t('act2Name'),
    3: t('act3Name'),
  };

  return (
    <main className="flex-1 bg-[#0a0a0c] relative overflow-hidden flex flex-col w-full h-full pb-8 select-none">
      <div className="px-6 py-3 flex justify-between items-center border-b border-slate-800/80 bg-[#0f1015]/90 backdrop-blur-xl z-10 shadow-lg shrink-0">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Kanban className="h-4 w-4" />
          </div>
          <div>
            <h1 className="font-bold text-slate-100 text-base">
              {t('act')} {activeAct}: {actTitleMap[activeAct] || t('act1Name')}
            </h1>
          </div>
          <Badge variant="primary">{filteredCards.length} {t('cards')}</Badge>
        </div>

        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="flex items-center space-x-1 rtl:space-x-reverse rounded-lg bg-slate-900 px-2 py-1 border border-slate-800 overflow-x-auto max-w-md">
            {actNumbers.map((actNum) => (
              <button
                key={actNum}
                onClick={() => setActiveAct(actNum)}
                className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold transition-all shrink-0 ${
                  activeAct === actNum
                    ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t('act')} {actNum}
              </button>
            ))}
            <button
              onClick={handleAddAct}
              className="px-2 py-1 rounded-md text-xs font-mono font-bold text-amber-400 border border-amber-500/30 hover:bg-amber-500/10 transition-all flex items-center space-x-1 rtl:space-x-reverse shrink-0 cursor-pointer"
              title={language === 'ar' ? 'إضافة فصل جديد إلى هذا المشروع' : 'Add New Act to Project'}
            >
              <Plus className="h-3 w-3" />
              <span>{language === 'ar' ? 'فصل جديد' : 'Add Act'}</span>
            </button>
          </div>

          <div className="h-4 w-[1px] bg-slate-800 my-auto" />

          <div className="flex items-center space-x-1 rtl:space-x-reverse rounded-lg bg-slate-900 p-1 border border-slate-800">
            <button onClick={() => handleZoom(-10)} className="p-1 text-slate-400 hover:text-white" title={t('zoomOut')}>
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="font-mono text-[11px] font-bold text-amber-400 px-1.5">{zoomLevel}%</span>
            <button onClick={() => handleZoom(10)} className="p-1 text-slate-400 hover:text-white" title={t('zoomIn')}>
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
          </div>

          <Button variant="primary" size="sm" onClick={handleAddCard}>
            <Plus className="h-3.5 w-3.5" />
            <span>{t('addNewCard')}</span>
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 md:p-8">
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max pb-24 transition-transform duration-200 origin-top-left"
          style={{ transform: `scale(${zoomLevel / 100})` }}
        >
          {filteredCards.map((card) => (
            <CardScene
              key={card.id}
              card={card}
              isSelected={card.id === selectedCardId}
              onSelect={() => setSelectedCardId(card.id)}
              onDoubleClick={() => handleOpenSceneInEditor(card)}
              onEdit={() => setIsNewSceneOpen(true)}
            />
          ))}

          <div
            onClick={() => setIsNewSceneOpen(true)}
            className="group rounded-2xl border-2 border-dashed border-slate-800 p-5 flex flex-col h-56 items-center justify-center text-slate-500 hover:text-amber-400 hover:border-amber-500/40 hover:bg-amber-500/5 transition-all cursor-pointer bg-slate-950/40"
          >
            <Plus className="h-8 w-8 mb-2 group-hover:scale-110 transition-transform text-amber-400" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider">{t('addNewCard')}</span>
          </div>
        </div>
      </div>
    </main>
  );
};

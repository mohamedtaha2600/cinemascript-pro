import React from 'react';
import { ScriptElementType } from '@/src/types';
import { useTranslation } from '@/src/hooks/useTranslation';
import { Clapperboard, AlignLeft, User, MessageSquare, Quote, MoveRight, Camera } from 'lucide-react';

export interface EditorToolbarProps {
  currentFormat: ScriptElementType;
  onFormatChange: (format: ScriptElementType) => void;
  onAddBlock?: (type: ScriptElementType) => void;
  pageNumber?: number;
  totalPages?: number;
  sceneNumber?: number;
  wordCount?: number;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  currentFormat,
  onFormatChange,
  pageNumber = 1,
  totalPages = 1,
  sceneNumber = 1,
  wordCount = 0,
}) => {
  const { t } = useTranslation();

  const formats: { type: ScriptElementType; label: string; shortcut: string; icon: any }[] = [
    { type: 'scene_heading', label: t('sceneHeading'), shortcut: '⌘1', icon: Clapperboard },
    { type: 'action', label: t('action'), shortcut: '⌘2', icon: AlignLeft },
    { type: 'character', label: t('character'), shortcut: 'Tab', icon: User },
    { type: 'parenthetical', label: t('parenthetical'), shortcut: '⌘4', icon: Quote },
    { type: 'dialogue', label: t('dialogue'), shortcut: '⌘5', icon: MessageSquare },
    { type: 'transition', label: t('transition'), shortcut: '⌘6', icon: MoveRight },
    { type: 'shot', label: t('shot'), shortcut: '⌘7', icon: Camera },
  ];

  return (
    <div className="flex items-center justify-between border-b border-slate-800/80 bg-[#0a0a0c]/80 px-6 py-2 backdrop-blur-md select-none shrink-0 font-sans">
      <div className="flex items-center space-x-1.5 rtl:space-x-reverse overflow-x-auto py-0.5">
        {formats.map((fmt) => {
          const IconComp = fmt.icon;
          const isActive = currentFormat === fmt.type;
          return (
            <button
              key={fmt.type}
              onClick={() => onFormatChange(fmt.type)}
              title={`${fmt.label} (${fmt.shortcut})`}
              className={`flex items-center space-x-2 rtl:space-x-reverse rounded-lg px-3 py-1.5 text-xs font-mono transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-slate-100 hover:border-slate-700'
              }`}
            >
              <IconComp className="h-3.5 w-3.5" />
              <span>{fmt.label}</span>
              <span className={`text-[10px] opacity-60 ${isActive ? 'text-black' : 'text-slate-500'}`}>
                {fmt.shortcut}
              </span>
            </button>
          );
        })}
      </div>

      <div className="hidden lg:flex items-center space-x-4 rtl:space-x-reverse font-mono text-[11px] text-slate-400">
        <span>
          {t('scNum')} <strong className="text-amber-400">{sceneNumber}</strong>
        </span>
        <span>•</span>
        <span>
          {t('pages')} <strong className="text-slate-200">{pageNumber}</strong> / {totalPages}
        </span>
        <span>•</span>
        <span>
          {t('words')} <strong className="text-slate-200">{wordCount.toLocaleString()}</strong>
        </span>
      </div>
    </div>
  );
};

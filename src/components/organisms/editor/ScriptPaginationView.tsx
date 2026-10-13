import React from 'react';
import { ScriptBlock } from '@/src/types';
import { PageSplit } from '@/src/utils/screenplay/metrics';
import { useTranslation } from '@/src/hooks/useTranslation';
import { ScriptBlockItem } from './ScriptBlockItem';

export interface ScriptPaginationViewProps {
  pages: PageSplit[];
  activeLineId: string;
  isFocusMode: boolean;
  isContinuousView: boolean;
  zoomLevel: number;
  onFocus: (id: string) => void;
  onChange: (id: string, text: string) => void;
  onKeyDown: (e: React.KeyboardEvent, block: ScriptBlock, index: number) => void;
  inputRef: (id: string, el: HTMLTextAreaElement | HTMLInputElement | null) => void;
}

export const ScriptPaginationView: React.FC<ScriptPaginationViewProps> = ({
  pages,
  activeLineId,
  isFocusMode,
  isContinuousView,
  zoomLevel,
  onFocus,
  onChange,
  onKeyDown,
  inputRef,
}) => {
  const { t, language } = useTranslation();
  let globalIndex = 0;

  return (
    <div
      className="mx-auto transition-transform duration-200 font-sans"
      style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
    >
      {pages.map((page) => (
        <div
          key={page.pageNumber}
          className={`relative mx-auto mb-10 bg-[#0f1015]/90 p-12 shadow-2xl border border-slate-800/80 rounded-2xl max-w-4xl min-h-[980px] backdrop-blur-xl ${
            isContinuousView ? 'mb-3 min-h-0 p-6' : ''
          }`}
        >
          <div className="flex justify-between items-center text-xs font-mono text-slate-500 mb-6 select-none border-b border-slate-800/60 pb-3">
            <span className="font-bold tracking-widest text-amber-500/60">
              {language === 'ar' ? 'مسودة معيار هوليوود القياسية' : 'HOLLYWOOD STANDARD DRAFT'}
            </span>
            <span className="rounded bg-slate-900 px-2 py-0.5 border border-slate-800 text-amber-400 font-bold">
              {language === 'ar' ? `صفحة ${page.pageNumber}` : `PAGE ${page.pageNumber}`}
            </span>
          </div>

          <div className="space-y-3">
            {page.blocks.map((block) => {
              const currentIdx = globalIndex++;
              return (
                <ScriptBlockItem
                  key={block.id}
                  block={block}
                  index={currentIdx}
                  isActive={block.id === activeLineId}
                  isFocusMode={isFocusMode}
                  onFocus={onFocus}
                  onChange={onChange}
                  onKeyDown={onKeyDown}
                  inputRef={(el) => inputRef(block.id, el)}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

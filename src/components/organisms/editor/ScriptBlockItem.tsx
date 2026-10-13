import React, { memo } from 'react';
import { ScriptBlock } from '@/src/types';
import { SCREENPLAY_ELEMENT_STYLES } from '@/src/constants/themeTokens';

export interface ScriptBlockItemProps {
  block: ScriptBlock;
  index: number;
  isActive: boolean;
  isFocusMode: boolean;
  onFocus: (id: string) => void;
  onChange: (id: string, text: string) => void;
  onKeyDown: (e: React.KeyboardEvent, block: ScriptBlock, index: number) => void;
  inputRef: (el: HTMLTextAreaElement | HTMLInputElement | null) => void;
}

export const ScriptBlockItem: React.FC<ScriptBlockItemProps> = memo(({
  block,
  index,
  isActive,
  isFocusMode,
  onFocus,
  onChange,
  onKeyDown,
  inputRef,
}) => {
  const isHeading = block.type === 'scene_heading';
  const styleClass = SCREENPLAY_ELEMENT_STYLES[block.type] || SCREENPLAY_ELEMENT_STYLES.action;

  return (
    <div
      className={`group relative flex items-start space-x-3 rounded-lg px-2 py-1 transition-all ${
        isActive
          ? 'bg-amber-500/5 ring-1 ring-amber-500/30 shadow-sm'
          : 'hover:bg-slate-900/40'
      } ${isFocusMode && !isActive ? 'opacity-25 blur-[0.4px] transition-opacity' : 'opacity-100'}`}
    >
      {isActive && (
        <div className="absolute left-0 top-1 bottom-1 w-0.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50" />
      )}

      <span className="w-8 pt-2.5 text-right font-mono text-[11px] text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity select-none shrink-0">
        {index + 1}
      </span>

      <div className="flex-1 overflow-hidden">
        {isHeading ? (
          <input
            ref={inputRef}
            type="text"
            value={block.text}
            onFocus={() => onFocus(block.id)}
            onChange={(e) => onChange(block.id, e.target.value)}
            onKeyDown={(e) => onKeyDown(e, block, index)}
            placeholder="INT. LOCATION - DAY"
            className={`w-full bg-transparent outline-none ${styleClass} ${
              block.highlight ? 'bg-amber-500/20 px-2 rounded' : ''
            }`}
          />
        ) : (
          <textarea
            ref={inputRef as any}
            rows={1}
            value={block.text}
            onFocus={() => onFocus(block.id)}
            onChange={(e) => onChange(block.id, e.target.value)}
            onKeyDown={(e) => onKeyDown(e, block, index)}
            placeholder="KINDLY WRITE YOUR SCREENPLAY..."
            className={`w-full resize-none bg-transparent outline-none ${styleClass} ${
              block.highlight ? 'bg-amber-500/20 px-2 rounded' : ''
            }`}
          />
        )}
      </div>
    </div>
  );
});

ScriptBlockItem.displayName = 'ScriptBlockItem';

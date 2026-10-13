import React from 'react';
import { CorkboardCard } from '@/src/types';
import { Edit2, GripVertical, FileText } from 'lucide-react';
import { Badge } from '@/src/components/atoms';

export interface CardSceneProps {
  card: CorkboardCard;
  isSelected?: boolean;
  onSelect?: () => void;
  onDoubleClick?: () => void;
  onEdit?: () => void;
}

export const CardScene: React.FC<CardSceneProps> = ({
  card,
  isSelected = false,
  onSelect,
  onDoubleClick,
  onEdit,
}) => {
  const colorTagMap: Record<CorkboardCard['colorTag'], { border: string; text: string; badge: 'cyan' | 'pink' | 'yellow' | 'emerald' }> = {
    'tag-blue': { border: 'border-l-4 border-l-cyan-500', text: 'text-cyan-400', badge: 'cyan' },
    'tag-pink': { border: 'border-l-4 border-l-pink-500', text: 'text-pink-400', badge: 'pink' },
    'tag-yellow': { border: 'border-l-4 border-l-amber-500', text: 'text-amber-400', badge: 'yellow' },
    'tag-green': { border: 'border-l-4 border-l-emerald-500', text: 'text-emerald-400', badge: 'emerald' },
  };

  const tagStyle = colorTagMap[card.colorTag] || colorTagMap['tag-blue'];

  return (
    <div
      onClick={onSelect}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onDoubleClick?.();
      }}
      className={`group relative flex h-56 flex-col rounded-2xl bg-[#0f1015]/90 p-5 shadow-xl backdrop-blur-xl transition-all duration-200 cursor-pointer border ${
        tagStyle.border
      } ${
        isSelected
          ? 'border-amber-500 shadow-amber-500/10 scale-[1.02]'
          : 'border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <Badge variant={isSelected ? 'primary' : 'default'} size="sm">
          SCENE {card.sceneNumber}
        </Badge>

        <div className="flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
            className="p-1 rounded text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <span className="p-1 text-slate-500 cursor-grab">
            <GripVertical className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>

      <h3 className="font-mono text-xs font-bold text-slate-100 uppercase tracking-wider line-clamp-2 mb-2 group-hover:text-amber-400 transition-colors">
        {card.slugline}
      </h3>

      <p className="font-mono text-[11px] text-slate-400 flex-1 overflow-hidden leading-relaxed line-clamp-3">
        {card.summary}
      </p>

      <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between font-mono text-[10px] text-slate-400">
        <span className="flex items-center space-x-1">
          <FileText className="h-3 w-3 text-amber-400" />
          <span>{card.pageCount}</span>
        </span>
        <span className={`font-bold uppercase tracking-wider ${tagStyle.text}`}>{card.tagLabel}</span>
      </div>
    </div>
  );
};

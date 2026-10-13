import React from 'react';
import { CharacterItem } from '@/src/types';
import { User, Sparkles } from 'lucide-react';

export interface CharacterCardGridProps {
  characters: CharacterItem[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export const CharacterCardGrid: React.FC<CharacterCardGridProps> = ({
  characters,
  selectedId,
  onSelect,
}) => {
  return (
    <div className="space-y-2 p-3">
      {characters.map((char) => (
        <div
          key={char.id}
          onClick={() => onSelect(char.id)}
          className={`flex items-center space-x-3 rounded-lg p-3 cursor-pointer transition-all border ${
            selectedId === char.id
              ? 'bg-amber-500/10 border-amber-500/40 text-slate-100 shadow-md'
              : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/80'
          }`}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-800 text-amber-400 border border-slate-700">
            <User className="h-5 w-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm truncate">{char.name}</h4>
              <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 border border-slate-700">
                {char.role}
              </span>
            </div>
            <p className="text-xs text-slate-500 truncate mt-0.5">{char.archetype}</p>
          </div>
        </div>
      ))}

      {characters.length === 0 && (
        <div className="p-8 text-center text-xs text-slate-500 font-mono">
          <Sparkles className="h-6 w-6 mx-auto mb-2 text-slate-600" />
          No characters registered yet. Click + to add.
        </div>
      )}
    </div>
  );
};

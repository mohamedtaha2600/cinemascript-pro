import React from 'react';
import { CharacterItem } from '@/src/types';
import { User, ChevronRight } from 'lucide-react';

export interface CharacterRosterListProps {
  characters: CharacterItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export const CharacterRosterList: React.FC<CharacterRosterListProps> = ({
  characters,
  selectedId,
  onSelect,
}) => {
  return (
    <div className="divide-y divide-slate-800/60">
      {characters.map((char) => (
        <div
          key={char.id}
          onClick={() => onSelect(char.id)}
          className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${
            selectedId === char.id ? 'bg-amber-500/10 border-l-2 border-amber-500' : 'hover:bg-slate-900/60'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-amber-400 border border-slate-700">
              <User className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-100">{char.name}</h4>
              <p className="text-xs text-slate-400 font-mono">{char.role} • {char.archetype}</p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-500" />
        </div>
      ))}
    </div>
  );
};

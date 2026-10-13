import React from 'react';
import { CharacterItem } from '@/src/types';
import { X, User, Sparkles } from 'lucide-react';
import { Button } from '@/src/components/atoms';

export interface CharacterDetailModalProps {
  character: CharacterItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CharacterDetailModal: React.FC<CharacterDetailModalProps> = ({
  character,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !character) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#0f1015] p-6 border border-amber-500/30 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-xl">{character.name}</h3>
              <p className="text-xs text-slate-400 font-mono">{character.archetype} • {character.role}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 text-slate-300 text-sm">
          <div>
            <h4 className="font-bold text-amber-400 text-xs tracking-wider uppercase mb-1">BIOGRAPHY & ARC</h4>
            <p className="leading-relaxed bg-slate-900/60 p-4 rounded-lg border border-slate-800">{character.bio}</p>
          </div>

          <div>
            <h4 className="font-bold text-amber-400 text-xs tracking-wider uppercase mb-2">CORE TRAITS</h4>
            <div className="flex flex-wrap gap-2">
              {character.traits.map((trait, idx) => (
                <span key={idx} className="rounded-full bg-slate-800 px-3 py-1 text-xs font-mono text-amber-300 border border-slate-700">
                  #{trait}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="outline" onClick={onClose}>
            Close Dossier
          </Button>
        </div>
      </div>
    </div>
  );
};

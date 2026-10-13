import React, { useState } from 'react';
import { useProject } from '@/src/context/ProjectContext';
import { useTranslation } from '@/src/hooks/useTranslation';
import { CharacterRosterList } from './characters/CharacterRosterList';
import { CharacterDetailModal } from './characters/CharacterDetailModal';
import { Plus, UserCheck } from 'lucide-react';
import { Button } from '@/src/components/atoms';

export const CharactersView: React.FC = () => {
  const { currentProject, addCharacter } = useProject();
  const { t } = useTranslation();
  const [selectedRole, setSelectedRole] = useState<'ALL' | 'Lead' | 'Supporting' | 'Minor'>('ALL');
  const [selectedCharId, setSelectedCharId] = useState<string | null>(
    currentProject.characters[0]?.id || null
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const filteredCharacters = currentProject.characters.filter((c) => {
    if (selectedRole === 'ALL') return true;
    return c.role === selectedRole;
  });

  const selectedChar = currentProject.characters.find((c) => c.id === selectedCharId) || filteredCharacters[0] || null;

  const handleAddQuick = () => {
    addCharacter({
      name: 'NEW CHARACTER',
      role: 'Lead',
      archetype: 'Protagonist',
      firstAppearance: 'Scene 1',
      bio: 'New character profile description...',
      traits: ['Dynamic', 'Story-Driven'],
    });
  };

  return (
    <div className="flex h-full bg-[#0a0a0c] text-slate-100 overflow-hidden">
      {/* Left Roster List */}
      <div className="w-80 border-r border-slate-800 flex flex-col bg-[#0f1015]">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <UserCheck className="h-5 w-5 text-amber-400" />
            <h3 className="font-bold text-slate-100 text-sm">ROSTER</h3>
          </div>
          <Button variant="primary" size="sm" onClick={handleAddQuick}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex border-b border-slate-800 p-1 text-xs font-mono bg-slate-950">
          {(['ALL', 'Lead', 'Supporting', 'Minor'] as const).map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`flex-1 py-1 text-center rounded transition-colors ${
                selectedRole === role ? 'bg-amber-500 text-black font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          <CharacterRosterList
            characters={filteredCharacters}
            selectedId={selectedCharId}
            onSelect={(id) => {
              setSelectedCharId(id);
              setIsDetailModalOpen(true);
            }}
          />
        </div>
      </div>

      {/* Main View */}
      <div className="flex-1 overflow-y-auto p-8 bg-[#121318]">
        {selectedChar ? (
          <div className="max-w-3xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-3xl font-extrabold text-amber-400 tracking-wide">{selectedChar.name}</h2>
                <p className="text-sm text-slate-400 font-mono mt-1">{selectedChar.archetype} • {selectedChar.role}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsDetailModalOpen(true)}>
                View Full Dossier
              </Button>
            </div>

            <div className="rounded-xl bg-slate-900/60 p-6 border border-slate-800 space-y-4">
              <h4 className="font-bold text-slate-200 text-sm tracking-wider uppercase">CHARACTER SUMMARY</h4>
              <p className="text-slate-300 leading-relaxed text-sm">{selectedChar.bio}</p>

              <div className="flex flex-wrap gap-2 pt-2">
                {selectedChar.traits.map((trait, idx) => (
                  <span key={idx} className="rounded-full bg-slate-800 px-3 py-1 text-xs font-mono text-amber-300 border border-slate-700">
                    #{trait}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-slate-500 font-mono text-sm">
            Select a character from the roster.
          </div>
        )}
      </div>

      <CharacterDetailModal
        character={selectedChar}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </div>
  );
};

import React, { useState } from 'react';
import { useProject } from '@/src/context/ProjectContext';
import { useTranslation } from '@/src/hooks/useTranslation';
import { CharacterCardGrid } from './bible/CharacterCardGrid';
import { LocationCardGrid } from './bible/LocationCardGrid';
import { Plus, User, MapPin } from 'lucide-react';
import { Button } from '@/src/components/atoms';

export const BibleDatabaseView: React.FC = () => {
  const { currentProject, addCharacter, addLocation } = useProject();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'CHARACTERS' | 'LOCATIONS'>('CHARACTERS');
  const [selectedCharId, setSelectedCharId] = useState<string>(currentProject.characters[0]?.id || '');
  const [selectedLocId, setSelectedLocId] = useState<string>(currentProject.locations[0]?.id || '');

  const selectedChar = currentProject.characters.find((c) => c.id === selectedCharId) || currentProject.characters[0];
  const selectedLoc = currentProject.locations.find((l) => l.id === selectedLocId) || currentProject.locations[0];

  const handleAddQuick = () => {
    if (activeTab === 'CHARACTERS') {
      addCharacter({
        name: 'NEW CHARACTER',
        role: 'Supporting',
        archetype: 'Secondary Figure',
        firstAppearance: 'Scene 1',
        bio: 'Auto generated bio summary...',
        traits: ['Dynamic', 'Key-Role'],
      });
    } else {
      addLocation({
        name: 'INT. NEW LOCATION',
        type: 'INT',
        description: 'Atmospheric setting description...',
        timeOfDay: 'DAY',
      });
    }
  };

  return (
    <div className="flex h-full bg-[#0a0a0c] text-slate-100 overflow-hidden">
      {/* Left Pane */}
      <div className="w-1/3 min-w-[320px] border-r border-slate-800 flex flex-col bg-[#0f1015]">
        <div className="flex items-center justify-between border-b border-slate-800 p-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('CHARACTERS')}
              className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                activeTab === 'CHARACTERS' ? 'bg-amber-500 text-black' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <User className="h-3.5 w-3.5" />
              <span>{t('characters')} ({currentProject.characters.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('LOCATIONS')}
              className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                activeTab === 'LOCATIONS' ? 'bg-blue-500 text-black' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <MapPin className="h-3.5 w-3.5" />
              <span>{t('locations')} ({currentProject.locations.length})</span>
            </button>
          </div>

          <Button variant="primary" size="sm" onClick={handleAddQuick} title="Quick Add">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === 'CHARACTERS' ? (
            <CharacterCardGrid
              characters={currentProject.characters}
              selectedId={selectedCharId}
              onSelect={setSelectedCharId}
            />
          ) : (
            <LocationCardGrid
              locations={currentProject.locations}
              selectedId={selectedLocId}
              onSelect={setSelectedLocId}
            />
          )}
        </div>
      </div>

      {/* Right Detail Pane */}
      <div className="flex-1 overflow-y-auto p-8 bg-[#121318]">
        {activeTab === 'CHARACTERS' && selectedChar ? (
          <div className="max-w-3xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-3xl font-extrabold text-amber-400 tracking-wide">{selectedChar.name}</h2>
                <p className="text-sm text-slate-400 font-mono mt-1">{selectedChar.archetype} • {selectedChar.role}</p>
              </div>
              <span className="rounded bg-amber-500/10 px-3 py-1 text-xs font-mono text-amber-400 border border-amber-500/20">
                APPEARANCE: {selectedChar.firstAppearance}
              </span>
            </div>

            <div className="rounded-xl bg-slate-900/60 p-6 border border-slate-800 space-y-4">
              <h4 className="font-bold text-slate-200 text-sm tracking-wider uppercase">CHARACTER DOSSIER & ARC</h4>
              <p className="text-slate-300 leading-relaxed text-sm font-sans">{selectedChar.bio}</p>

              <div className="flex flex-wrap gap-2 pt-2">
                {selectedChar.traits.map((trait, idx) => (
                  <span key={idx} className="rounded-full bg-slate-800 px-3 py-1 text-xs font-mono text-amber-300 border border-slate-700">
                    #{trait}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : activeTab === 'LOCATIONS' && selectedLoc ? (
          <div className="max-w-3xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-3xl font-extrabold text-blue-400 tracking-wide">{selectedLoc.name}</h2>
                <p className="text-sm text-slate-400 font-mono mt-1">{selectedLoc.type} • {selectedLoc.timeOfDay}</p>
              </div>
            </div>

            <div className="rounded-xl bg-slate-900/60 p-6 border border-slate-800">
              <h4 className="font-bold text-slate-200 text-sm tracking-wider uppercase mb-2">LOCATION ATMOSPHERE</h4>
              <p className="text-slate-300 leading-relaxed text-sm">{selectedLoc.description}</p>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-slate-500 font-mono text-sm">
            Select an entry from the left database panel to view full dossier.
          </div>
        )}
      </div>
    </div>
  );
};

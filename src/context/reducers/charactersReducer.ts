import { CharacterItem } from '@/src/types';
import { CharactersAction } from '../types/projectStateTypes';

export function charactersReducer(state: CharacterItem[], action: CharactersAction): CharacterItem[] {
  switch (action.type) {
    case 'SET_CHARACTERS':
      return action.payload;

    case 'ADD_CHARACTER':
      return [action.payload, ...state];

    case 'UPDATE_CHARACTER': {
      const { id, partial } = action.payload;
      return state.map((c) => (c.id === id ? { ...c, ...partial } : c));
    }

    case 'UPDATE_OR_ADD_CHARACTER': {
      const { name, traits = [], arc, role = 'Supporting' } = action.payload;
      const existing = state.find((c) => c.name.toLowerCase() === name.toLowerCase());

      if (existing) {
        return state.map((c) =>
          c.id === existing.id
            ? {
                ...c,
                traits: Array.from(new Set([...c.traits, ...traits])),
                arc: arc || c.arc,
                role: role || c.role,
              }
            : c
        );
      }

      const newChar: CharacterItem = {
        id: `chr-${Date.now()}`,
        name,
        role,
        archetype: role === 'Lead' ? 'Protagonist' : 'Key Figure',
        firstAppearance: 'Auto-detected via AI',
        dialogueCount: 0,
        scenesCount: 1,
        bio: arc || `Character created via CinemaScript AI Assistant.`,
        traits: traits.length > 0 ? traits : ['Dynamic', 'Story-Driven'],
        arc,
      };

      return [newChar, ...state];
    }

    default:
      return state;
  }
}

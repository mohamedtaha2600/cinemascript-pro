import { CorkboardCard } from '@/src/types';
import { CorkboardAction } from '../types/projectStateTypes';

export function corkboardReducer(state: CorkboardCard[], action: CorkboardAction): CorkboardCard[] {
  switch (action.type) {
    case 'SET_CARDS':
      return action.payload;

    case 'ADD_CARD':
      return [...state, action.payload];

    case 'REORDER_CARD_BY_SCENE_ID': {
      const { sceneId, newPosition } = action.payload;
      const cards = [...state];
      const normalizedTarget = sceneId.replace(/^(scene_|card-)/i, '');
      const idx = cards.findIndex(
        (c) => c.id === sceneId || String(c.sceneNumber) === normalizedTarget || c.id.includes(sceneId)
      );

      if (idx === -1) return state;

      const [item] = cards.splice(idx, 1);
      const insertAt = Math.max(0, Math.min(newPosition - 1, cards.length));
      cards.splice(insertAt, 0, item);

      // Re-number scene cards cleanly
      return cards.map((c, i) => ({ ...c, sceneNumber: i + 1 }));
    }

    default:
      return state;
  }
}

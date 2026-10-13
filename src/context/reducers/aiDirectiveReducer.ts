import { AICoreDirective } from '@/src/types';
import { AiDirectiveAction } from '../types/projectStateTypes';

export interface AiLogEntry {
  id: string;
  timestamp: string;
  directive: AICoreDirective;
  rawInput?: string;
}

export function aiDirectiveReducer(state: AiLogEntry[], action: AiDirectiveAction): AiLogEntry[] {
  switch (action.type) {
    case 'ADD_AI_LOG':
      return [action.payload, ...state.slice(0, 19)];

    case 'CLEAR_AI_LOGS':
      return [];

    default:
      return state;
  }
}

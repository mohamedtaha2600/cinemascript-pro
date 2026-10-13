import { BreakdownRow } from '@/src/types';
import { BreakdownAction } from '../types/projectStateTypes';

export function breakdownReducer(state: BreakdownRow[], action: BreakdownAction): BreakdownRow[] {
  switch (action.type) {
    case 'SET_BREAKDOWN':
      return action.payload;

    case 'ADD_BREAKDOWN_ROW':
      return [...state, action.payload];

    default:
      return state;
  }
}

import { LocationItem } from '@/src/types';
import { LocationsAction } from '../types/projectStateTypes';

export function locationsReducer(state: LocationItem[], action: LocationsAction): LocationItem[] {
  switch (action.type) {
    case 'SET_LOCATIONS':
      return action.payload;

    case 'ADD_LOCATION':
      return [...state, action.payload];

    default:
      return state;
  }
}

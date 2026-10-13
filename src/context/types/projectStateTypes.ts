import { 
  ScriptBlock, 
  CorkboardCard, 
  BreakdownRow, 
  CharacterItem, 
  LocationItem, 
  ScriptElementType,
  AICoreDirective
} from '@/src/types';

export type ScriptAction =
  | { type: 'SET_SCRIPT_BLOCKS'; payload: ScriptBlock[] }
  | { type: 'ADD_SCRIPT_BLOCK'; payload: ScriptBlock }
  | { type: 'INSERT_SCRIPT_BLOCK_AT_INDEX'; payload: { blockType: ScriptElementType; character: string; text: string; index?: number | null } }
  | { type: 'DELETE_PAGE'; payload: { pageNumber: number } }
  | { type: 'DELETE_SCENE'; payload: { sceneNumberOrId: number | string } }
  | { type: 'MOVE_SCENE'; payload: { sceneNumber: number; direction: 'up' | 'down' } }
  | { type: 'REWRITE_SCENE_BLOCK'; payload: { blockIdOrSceneNumber: string | number; newText: string } }
  | { type: 'HIGHLIGHT_SCRIPT_RANGE'; payload: { startLine: number; endLine: number; color?: string } };

export type CorkboardAction =
  | { type: 'SET_CARDS'; payload: CorkboardCard[] }
  | { type: 'ADD_CARD'; payload: CorkboardCard }
  | { type: 'REORDER_CARD_BY_SCENE_ID'; payload: { sceneId: string; newPosition: number } };

export type BreakdownAction =
  | { type: 'SET_BREAKDOWN'; payload: BreakdownRow[] }
  | { type: 'ADD_BREAKDOWN_ROW'; payload: BreakdownRow };

export type CharactersAction =
  | { type: 'SET_CHARACTERS'; payload: CharacterItem[] }
  | { type: 'ADD_CHARACTER'; payload: CharacterItem }
  | { type: 'UPDATE_CHARACTER'; payload: { id: string; partial: Partial<CharacterItem> } }
  | { type: 'UPDATE_OR_ADD_CHARACTER'; payload: { name: string; traits?: string[]; arc?: string; role?: 'Lead' | 'Supporting' | 'Minor' } };

export type LocationsAction =
  | { type: 'SET_LOCATIONS'; payload: LocationItem[] }
  | { type: 'ADD_LOCATION'; payload: LocationItem };

export type AiDirectiveAction =
  | { type: 'ADD_AI_LOG'; payload: { id: string; timestamp: string; directive: AICoreDirective; rawInput?: string } }
  | { type: 'CLEAR_AI_LOGS' };

export type ViewMode = 
  | 'projects' 
  | 'editor' 
  | 'outliner' 
  | 'breakdown' 
  | 'bible' 
  | 'characters' 
  | 'community' 
  | 'revisions' 
  | 'settings'
  | 'shotlist'
  | 'pacing'
  | 'dood';

export type ScriptElementType = 
  | 'scene_heading'
  | 'action'
  | 'character'
  | 'parenthetical'
  | 'dialogue'
  | 'transition'
  | 'shot';

export interface ScriptBlock {
  id: string;
  type: ScriptElementType;
  text: string;
  characterName?: string;
  sceneNumber?: number;
  highlight?: boolean;
}

export interface CharacterItem {
  id: string;
  name: string;
  role: 'Lead' | 'Supporting' | 'Minor';
  archetype: string;
  firstAppearance: string;
  dialogueCount: number;
  scenesCount: number;
  bio: string;
  traits: string[];
  imageUrl?: string;
  arc?: string;
}

export interface LocationItem {
  id: string;
  name: string;
  type: 'INT' | 'EXT' | 'INT/EXT';
  scenesCount: number;
  description: string;
  timeOfDay: 'DAY' | 'NIGHT' | 'CONTINUOUS' | 'LATER';
}

export interface CorkboardCard {
  id: string;
  sceneNumber: number;
  slugline: string;
  summary: string;
  pageCount: string;
  colorTag: 'tag-blue' | 'tag-pink' | 'tag-yellow' | 'tag-green';
  tagLabel: string;
  act: number;
}

export interface BreakdownRow {
  id: string;
  sceneNumber: number;
  setting: 'INT' | 'EXT' | 'INT/EXT';
  location: string;
  timeOfDay: 'DAY' | 'NIGHT' | 'DUSK' | 'DAWN' | 'CONTINUOUS';
  characters: string[];
  props: string[];
  wardrobe: string[];
  estPages?: string;
}

export interface ShotItem {
  id: string;
  sceneNumber: number;
  shotNumber: string;
  shotType: 'Wide' | 'Medium' | 'Close-up' | 'Over-the-shoulder' | 'POV' | 'Tracking' | 'Drone';
  angle: 'Eye Level' | 'High Angle' | 'Low Angle' | 'Dutch Angle' | 'Bird Eye';
  movement: 'Static' | 'Pan' | 'Tilt' | 'Dolly' | 'Steadicam' | 'Handheld';
  description: string;
  linkedBlockId?: string;
  lensMm?: string;
}

export interface ScriptRevision {
  id: string;
  colorHex: string;
  colorName: string;
  label: string;
  timestamp: string;
  isLocked: boolean;
  modifiedBlocksCount: number;
  author: string;
  notes?: string;
}

export interface DoodEntry {
  characterName: string;
  actorName: string;
  days: Record<string, 'SW' | 'W' | 'WF' | 'F' | 'I' | '-'>;
  totalWorkDays: number;
}

export interface ProjectData {
  id: string;
  title: string;
  subtitle: string;
  formatType: 'Feature Film' | 'Television Series';
  badge: 'FEATURE' | 'PILOT';
  actStructure: number;
  targetPages: number;
  pages: number;
  words: number;
  scenesCount: number;
  lastEdited: string;
  author: string;
  scriptBlocks: ScriptBlock[];
  cards: CorkboardCard[];
  breakdown: BreakdownRow[];
  characters: CharacterItem[];
  locations: LocationItem[];
  shots?: ShotItem[];
  revisions?: ScriptRevision[];
}

export interface AICoreAssistantResponse {
  message: string;
  ui_thought_process: string;
}

export interface AINavigationDirective {
  target_view: string | null;
  target_scene_id: string | null;
  target_character_id: string | null;
}

export interface AIToolCall {
  tool_name: string;
  parameters: Record<string, unknown>;
}

export interface AIEditorMutation {
  action: 'NONE' | 'INSERT' | 'REPLACE' | 'DELETE' | 'APPEND';
  target_element: 'SCENE_HEADING' | 'ACTION' | 'CHARACTER' | 'PARENTHETICAL' | 'DIALOGUE' | 'TRANSITION' | null;
  content: string | null;
  position_index: number | null;
}

export interface AICoreDirective {
  assistant_response: AICoreAssistantResponse;
  navigation_directive: AINavigationDirective;
  tool_calls: AIToolCall[];
  editor_mutation: AIEditorMutation;
}

export type AIProviderType = 'gemini' | 'custom_host' | 'extension_bridge';

export type MCPToolCategory = 'inspect' | 'write' | 'production' | 'autonomous';

export interface MCPToolDefinition {
  id: string;
  name: string;
  category: MCPToolCategory;
  descriptionAr: string;
  descriptionEn: string;
  parametersSchema: Record<string, unknown>;
  enabled: boolean;
}

export interface AIConnectionConfig {
  provider: AIProviderType;
  customHostUrl: string;
  customEndpointType: 'direct_json' | 'openai' | 'custom_proxy';
  customModel: string;
  customApiKey: string;
  autoExecuteDirectives: boolean;
  enabledMcpTools?: string[];
  lastConnectionStatus?: {
    success: boolean;
    latencyMs?: number;
    message?: string;
    timestamp?: string;
  };
}


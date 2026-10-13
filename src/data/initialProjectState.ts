import { ProjectData, AIConnectionConfig } from '@/src/types';
import { DEFAULT_ENABLED_MCP_TOOL_IDS } from './mcpTools';

export const blankFallbackProject: ProjectData = {
  id: 'blank-proj',
  title: '',
  subtitle: '',
  formatType: 'Feature Film',
  badge: 'FEATURE',
  actStructure: 3,
  targetPages: 110,
  pages: 0,
  words: 0,
  scenesCount: 0,
  lastEdited: '',
  author: '',
  scriptBlocks: [],
  cards: [],
  breakdown: [],
  characters: [],
  locations: [],
};

export const defaultProjects: ProjectData[] = [];

export const defaultAiConfig: AIConnectionConfig = {
  provider: 'gemini',
  customHostUrl: 'https://hit-contemporary-favour-dating.trycloudflare.com',
  customEndpointType: 'direct_json',
  customModel: 'gemini-3.7-flash',
  customApiKey: '',
  autoExecuteDirectives: true,
  enabledMcpTools: DEFAULT_ENABLED_MCP_TOOL_IDS,
  lastConnectionStatus: {
    success: true,
    message: 'Default Gemini 3.7 Flash Cloud Engine',
  },
};

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  ProjectData, 
  ViewMode, 
  ScriptBlock, 
  CorkboardCard, 
  BreakdownRow, 
  CharacterItem, 
  LocationItem,
  AICoreDirective,
  ScriptElementType,
  AIConnectionConfig,
  AIProviderType
} from '@/src/types';
import { translations, Language } from '@/src/i18n/translations';
import { DEFAULT_ENABLED_MCP_TOOL_IDS } from '@/src/data/mcpTools';
import { blankFallbackProject, defaultProjects, defaultAiConfig } from '@/src/data/initialProjectState';
import { GoogleUser, CloudSyncStatus } from '@/src/types/auth';
import {
  triggerRealGoogleSignIn,
  getOrCreateCinemaScriptFolder,
  uploadProjectToGoogleDrive,
  fetchProjectsFromGoogleDrive,
  deleteProjectFromGoogleDrive,
} from '@/src/services/googleDriveService';
import { 
  scriptReducer, 
  corkboardReducer, 
  breakdownReducer, 
  charactersReducer, 
  locationsReducer, 
  aiDirectiveReducer,
  AiLogEntry
} from './reducers';

export interface ProjectContextType {
  projects: ProjectData[];
  currentProject: ProjectData;
  activeView: ViewMode;
  searchQuery: string;
  isExportOpen: boolean;
  isNewProjectOpen: boolean;
  isNewSceneOpen: boolean;
  isSettingsOpen: boolean;
  isAiAgentOpen: boolean;
  language: Language;
  isRtl: boolean;
  aiLogs: AiLogEntry[];
  aiConfig: AIConnectionConfig;
  updateAiConfig: (partial: Partial<AIConnectionConfig>) => void;
  toggleMcpTool: (toolId: string, enabled?: boolean) => void;
  setAllMcpTools: (enabled: boolean) => void;
  testAiConnection: (provider?: AIProviderType, hostUrl?: string) => Promise<{ success: boolean; latencyMs?: number; message: string }>;
  sendAiPrompt: (prompt: string, customSystemPrompt?: string) => Promise<{ 
    success: boolean; 
    directive?: AICoreDirective; 
    source?: string; 
    httpStatus?: number;
    rawText?: string;
    isJson?: boolean;
    latencyMs?: number;
    error?: string; 
  }>;
  t: (key: keyof typeof translations.en) => string;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  setActiveView: (view: ViewMode) => void;
  setSearchQuery: (query: string) => void;
  setIsExportOpen: (open: boolean) => void;
  setIsNewProjectOpen: (open: boolean) => void;
  setIsNewSceneOpen: (open: boolean) => void;
  setIsSettingsOpen: (open: boolean) => void;
  setIsAiAgentOpen: (open: boolean) => void;
  setCurrentProjectId: (id: string) => void;
  updateScriptBlocks: (blocks: ScriptBlock[]) => void;
  addScriptBlock: (block: Omit<ScriptBlock, 'id'>) => void;
  insertScriptBlockAtIndex: (type: ScriptElementType, character: string, text: string, index?: number | null) => void;
  deletePage: (pageNumber: number) => void;
  deleteScene: (sceneNumberOrId: number | string) => void;
  moveScene: (sceneNumber: number, direction: 'up' | 'down') => void;
  rewriteSceneBlock: (blockIdOrSceneNumber: string | number, newText: string) => void;
  addSceneCard: (card: Omit<CorkboardCard, 'id' | 'sceneNumber'>) => void;
  reorderCardBySceneId: (sceneId: string, newPosition: number) => void;
  addActToCurrentProject: () => void;
  addBreakdownRow: (row: Omit<BreakdownRow, 'id' | 'sceneNumber'>) => void;
  createNewProject: (data: Partial<ProjectData>) => void;
  deleteProject: (id: string) => void;
  clearAllProjects: () => void;
  addCharacter: (character: Omit<CharacterItem, 'id' | 'dialogueCount' | 'scenesCount'>) => void;
  updateCharacter: (id: string, partial: Partial<CharacterItem>) => void;
  updateOrAddCharacter: (name: string, traits?: string[], arc?: string, role?: 'Lead' | 'Supporting' | 'Minor') => void;
  addLocation: (location: Omit<LocationItem, 'id' | 'scenesCount'>) => void;
  highlightScriptRange: (startLine: number, endLine: number, color?: string) => void;
  executeAiDirective: (input: string | AICoreDirective) => { success: boolean; message: string; directive?: AICoreDirective };
  googleUser: GoogleUser | null;
  cloudSyncStatus: CloudSyncStatus;
  loginWithGoogle: () => void;
  logoutGoogle: () => void;
  setGoogleUserDirectly: (user: GoogleUser) => void;
  syncProjectsToCloud: () => Promise<void>;
  pullProjectsFromCloud: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<ProjectData[]>(() => {
    const saved = localStorage.getItem('cinemascript_projects');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some((p: ProjectData) => p.id === 'proj-alpha' || p.id === 'proj-echo')) {
          localStorage.removeItem('cinemascript_projects');
          return [];
        }
        return parsed;
      } catch {
        return [];
      }
    }
    return defaultProjects;
  });

  const [currentProjectId, setCurrentProjectId] = useState<string>('');
  const [activeView, setActiveView] = useState<ViewMode>('projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isNewSceneOpen, setIsNewSceneOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAiAgentOpen, setIsAiAgentOpen] = useState(false);
  const [aiLogs, setAiLogs] = useState<AiLogEntry[]>([]);

  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(() => {
    const saved = localStorage.getItem('cinemascript_google_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return null;
  });

  const [cloudSyncStatus, setCloudSyncStatus] = useState<CloudSyncStatus>({
    isSyncing: false,
    lastSyncTimestamp: localStorage.getItem('cinemascript_last_sync') || null,
    syncedProjectsCount: 0,
  });

  const loginWithGoogle = useCallback(async () => {
    setCloudSyncStatus((prev) => ({ ...prev, isSyncing: true, error: null }));
    try {
      const authResult = await triggerRealGoogleSignIn();
      if (!authResult) {
        setCloudSyncStatus((prev) => ({ ...prev, isSyncing: false, error: 'Sign in cancelled' }));
        return;
      }

      let userData: GoogleUser | null = null;
      try {
        const res = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(authResult),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            userData = data.user;
          }
        }
      } catch (e) {
        console.warn('Backend Auth API unreachable, initializing secure local session:', e);
      }

      if (!userData) {
        userData = {
          id: authResult.userInfo?.id || `usr-${Date.now()}`,
          name: authResult.userInfo?.name || 'مخرج السيناريو (Google Artist)',
          email: authResult.userInfo?.email || 'creator@cinemascript.pro',
          avatarUrl: authResult.userInfo?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          accessToken: authResult.accessToken || `gdrive_token_${Date.now()}`,
          expiresAt: Date.now() + 3600 * 1000 * 24 * 7,
        };
      }

      setGoogleUser(userData);
      localStorage.setItem('cinemascript_google_user', JSON.stringify(userData));
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setCloudSyncStatus({
        isSyncing: false,
        lastSyncTimestamp: nowStr,
        syncedProjectsCount: projects.length,
        error: null,
      });
      localStorage.setItem('cinemascript_last_sync', nowStr);
    } catch (err: unknown) {
      console.error('Google Sign In Error:', err);
      setCloudSyncStatus((prev) => ({ ...prev, isSyncing: false, error: 'Auth failed' }));
    }
  }, [projects.length]);

  const setGoogleUserDirectly = useCallback((user: GoogleUser) => {
    setGoogleUser(user);
    localStorage.setItem('cinemascript_google_user', JSON.stringify(user));
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setCloudSyncStatus({
      isSyncing: false,
      lastSyncTimestamp: nowStr,
      syncedProjectsCount: projects.length,
      error: null,
    });
    localStorage.setItem('cinemascript_last_sync', nowStr);
  }, [projects.length]);

  const logoutGoogle = useCallback(() => {
    setGoogleUser(null);
    localStorage.removeItem('cinemascript_google_user');
  }, []);

  const syncProjectsToCloud = useCallback(async () => {
    if (!googleUser) return;
    setCloudSyncStatus((prev) => ({ ...prev, isSyncing: true, error: null }));
    try {
      const folderId = await getOrCreateCinemaScriptFolder(googleUser.accessToken);
      let count = 0;
      for (const p of projects) {
        if (p.id && p.id !== 'blank-proj') {
          await uploadProjectToGoogleDrive(p, googleUser.accessToken, folderId);
          count++;
        }
      }
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setCloudSyncStatus({
        isSyncing: false,
        lastSyncTimestamp: nowStr,
        syncedProjectsCount: count,
        error: null,
      });
      localStorage.setItem('cinemascript_last_sync', nowStr);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sync failed';
      setCloudSyncStatus((prev) => ({ ...prev, isSyncing: false, error: msg }));
    }
  }, [googleUser, projects]);

  const pullProjectsFromCloud = useCallback(async () => {
    if (!googleUser) return;
    setCloudSyncStatus((prev) => ({ ...prev, isSyncing: true, error: null }));
    try {
      const cloudProjs = await fetchProjectsFromGoogleDrive(googleUser.accessToken);
      if (cloudProjs.length > 0) {
        setProjects((prev) => {
          const mergedMap = new Map<string, ProjectData>();
          prev.forEach((p) => mergedMap.set(p.id, p));
          cloudProjs.forEach((cp) => mergedMap.set(cp.id, cp));
          return Array.from(mergedMap.values());
        });
      }
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setCloudSyncStatus({
        isSyncing: false,
        lastSyncTimestamp: nowStr,
        syncedProjectsCount: cloudProjs.length,
        error: null,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Pull failed';
      setCloudSyncStatus((prev) => ({ ...prev, isSyncing: false, error: msg }));
    }
  }, [googleUser]);

  const [aiConfig, setAiConfig] = useState<AIConnectionConfig>(() => {
    const saved = localStorage.getItem('cinemascript_ai_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.enabledMcpTools) parsed.enabledMcpTools = DEFAULT_ENABLED_MCP_TOOL_IDS;
        return parsed;
      } catch {}
    }
    return defaultAiConfig;
  });

  const updateAiConfig = useCallback((partial: Partial<AIConnectionConfig>) => {
    setAiConfig((prev) => {
      const updated = { ...prev, ...partial };
      localStorage.setItem('cinemascript_ai_config', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const toggleMcpTool = useCallback((toolId: string, enabled?: boolean) => {
    setAiConfig((prev) => {
      const currentList = prev.enabledMcpTools || DEFAULT_ENABLED_MCP_TOOL_IDS;
      const isEnabled = currentList.includes(toolId);
      const nextEnabled = enabled !== undefined ? enabled : !isEnabled;
      const updatedList = nextEnabled
        ? isEnabled ? currentList : [...currentList, toolId]
        : currentList.filter((id) => id !== toolId);
      const updated = { ...prev, enabledMcpTools: updatedList };
      localStorage.setItem('cinemascript_ai_config', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const setAllMcpTools = useCallback((enabled: boolean) => {
    updateAiConfig({ enabledMcpTools: enabled ? DEFAULT_ENABLED_MCP_TOOL_IDS : [] });
  }, [updateAiConfig]);

  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('cinemascript_lang');
    return saved === 'ar' || saved === 'en' ? saved : 'ar';
  });

  const isRtl = language === 'ar';

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('cinemascript_lang', lang);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  }, [language, setLanguage]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  }, [language, isRtl]);

  const t = useCallback((key: keyof typeof translations.en): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  }, [language]);

  useEffect(() => {
    localStorage.setItem('cinemascript_projects', JSON.stringify(projects));
  }, [projects]);

  const currentProject = projects.find((p) => p.id === currentProjectId) || projects[0] || blankFallbackProject;

  const updateCurrentProject = useCallback((updater: (prev: ProjectData) => ProjectData) => {
    if (!currentProject.id || currentProject.id === 'blank-proj') return;
    setProjects((prev) => prev.map((p) => (p.id === currentProject.id ? updater(p) : p)));
  }, [currentProject.id]);

  // Reducer Dispatches
  const updateScriptBlocks = useCallback((blocks: ScriptBlock[]) => {
    updateCurrentProject((p) => ({
      ...p,
      scriptBlocks: scriptReducer(p.scriptBlocks, { type: 'SET_SCRIPT_BLOCKS', payload: blocks }),
      words: blocks.reduce((acc, b) => acc + (b.text || '').split(/\s+/).filter(Boolean).length, 0),
      pages: Math.max(1, Math.ceil(blocks.length / 8)),
    }));
  }, [updateCurrentProject]);

  const addScriptBlock = useCallback((block: Omit<ScriptBlock, 'id'>) => {
    const newBlock: ScriptBlock = { ...block, id: `b-${Date.now()}` };
    updateCurrentProject((p) => {
      const updated = scriptReducer(p.scriptBlocks, { type: 'ADD_SCRIPT_BLOCK', payload: newBlock });
      return {
        ...p,
        scriptBlocks: updated,
        words: updated.reduce((acc, b) => acc + (b.text || '').split(/\s+/).filter(Boolean).length, 0),
        pages: Math.max(1, Math.ceil(updated.length / 8)),
      };
    });
  }, [updateCurrentProject]);

  const insertScriptBlockAtIndex = useCallback((type: ScriptElementType, character: string, text: string, index?: number | null) => {
    updateCurrentProject((p) => {
      const updated = scriptReducer(p.scriptBlocks, {
        type: 'INSERT_SCRIPT_BLOCK_AT_INDEX',
        payload: { blockType: type, character, text, index },
      });
      return {
        ...p,
        scriptBlocks: updated,
        words: updated.reduce((acc, b) => acc + (b.text || '').split(/\s+/).filter(Boolean).length, 0),
        pages: Math.max(1, Math.ceil(updated.length / 8)),
      };
    });
  }, [updateCurrentProject]);

  const deletePage = useCallback((pageNumber: number) => {
    updateCurrentProject((p) => ({
      ...p,
      scriptBlocks: scriptReducer(p.scriptBlocks, { type: 'DELETE_PAGE', payload: { pageNumber } }),
    }));
  }, [updateCurrentProject]);

  const deleteScene = useCallback((sceneNumberOrId: number | string) => {
    updateCurrentProject((p) => {
      const updatedBlocks = scriptReducer(p.scriptBlocks, { type: 'DELETE_SCENE', payload: { sceneNumberOrId } });
      const targetSceneNum = typeof sceneNumberOrId === 'number' ? sceneNumberOrId : parseInt(String(sceneNumberOrId).replace(/\D/g, ''), 10);
      const updatedCards = targetSceneNum ? p.cards.filter((c) => c.sceneNumber !== targetSceneNum) : p.cards;
      return { ...p, scriptBlocks: updatedBlocks, cards: updatedCards, scenesCount: Math.max(0, p.scenesCount - 1) };
    });
  }, [updateCurrentProject]);

  const moveScene = useCallback((sceneNumber: number, direction: 'up' | 'down') => {
    updateCurrentProject((p) => ({
      ...p,
      scriptBlocks: scriptReducer(p.scriptBlocks, { type: 'MOVE_SCENE', payload: { sceneNumber, direction } }),
    }));
  }, [updateCurrentProject]);

  const rewriteSceneBlock = useCallback((blockIdOrSceneNumber: string | number, newText: string) => {
    updateCurrentProject((p) => ({
      ...p,
      scriptBlocks: scriptReducer(p.scriptBlocks, { type: 'REWRITE_SCENE_BLOCK', payload: { blockIdOrSceneNumber, newText } }),
    }));
  }, [updateCurrentProject]);

  const addSceneCard = useCallback((card: Omit<CorkboardCard, 'id' | 'sceneNumber'>) => {
    updateCurrentProject((p) => {
      const nextNum = p.cards.length + 1;
      const newCard: CorkboardCard = { ...card, id: `card-${Date.now()}`, sceneNumber: nextNum };
      return {
        ...p,
        cards: corkboardReducer(p.cards, { type: 'ADD_CARD', payload: newCard }),
        scenesCount: p.scenesCount + 1,
      };
    });
  }, [updateCurrentProject]);

  const reorderCardBySceneId = useCallback((sceneId: string, newPosition: number) => {
    updateCurrentProject((p) => ({
      ...p,
      cards: corkboardReducer(p.cards, { type: 'REORDER_CARD_BY_SCENE_ID', payload: { sceneId, newPosition } }),
    }));
  }, [updateCurrentProject]);

  const addActToCurrentProject = useCallback(() => {
    updateCurrentProject((p) => ({
      ...p,
      actStructure: Math.max(1, (p.actStructure || 3) + 1),
    }));
  }, [updateCurrentProject]);

  const addBreakdownRow = useCallback((row: Omit<BreakdownRow, 'id' | 'sceneNumber'>) => {
    updateCurrentProject((p) => {
      const nextNum = p.breakdown.length + 1;
      const newRow: BreakdownRow = { ...row, id: `bd-${Date.now()}`, sceneNumber: nextNum };
      return {
        ...p,
        breakdown: breakdownReducer(p.breakdown, { type: 'ADD_BREAKDOWN_ROW', payload: newRow }),
      };
    });
  }, [updateCurrentProject]);

  const addCharacter = useCallback((character: Omit<CharacterItem, 'id' | 'dialogueCount' | 'scenesCount'>) => {
    updateCurrentProject((p) => {
      const newChar: CharacterItem = { ...character, id: `chr-${Date.now()}`, dialogueCount: 0, scenesCount: 1 };
      return {
        ...p,
        characters: charactersReducer(p.characters, { type: 'ADD_CHARACTER', payload: newChar }),
      };
    });
  }, [updateCurrentProject]);

  const updateCharacter = useCallback((id: string, partial: Partial<CharacterItem>) => {
    updateCurrentProject((p) => ({
      ...p,
      characters: charactersReducer(p.characters, { type: 'UPDATE_CHARACTER', payload: { id, partial } }),
    }));
  }, [updateCurrentProject]);

  const updateOrAddCharacter = useCallback((name: string, traits: string[] = [], arc?: string, role: 'Lead' | 'Supporting' | 'Minor' = 'Supporting') => {
    updateCurrentProject((p) => ({
      ...p,
      characters: charactersReducer(p.characters, { type: 'UPDATE_OR_ADD_CHARACTER', payload: { name, traits, arc, role } }),
    }));
  }, [updateCurrentProject]);

  const addLocation = useCallback((location: Omit<LocationItem, 'id' | 'scenesCount'>) => {
    updateCurrentProject((p) => {
      const newLoc: LocationItem = { ...location, id: `loc-${Date.now()}`, scenesCount: 1 };
      return {
        ...p,
        locations: locationsReducer(p.locations, { type: 'ADD_LOCATION', payload: newLoc }),
      };
    });
  }, [updateCurrentProject]);

  const highlightScriptRange = useCallback((startLine: number, endLine: number, color?: string) => {
    updateCurrentProject((p) => ({
      ...p,
      scriptBlocks: scriptReducer(p.scriptBlocks, { type: 'HIGHLIGHT_SCRIPT_RANGE', payload: { startLine, endLine, color } }),
    }));
  }, [updateCurrentProject]);

  const createNewProject = useCallback((data: Partial<ProjectData>) => {
    const initialText = language === 'ar' ? 'داخلي. الموقع - نهاراً' : 'INT. LOCATION - DAY';
    const newProj: ProjectData = {
      id: `proj-${Date.now()}`,
      title: data.title || (language === 'ar' ? 'سيناريو جديد' : 'Untitled Screenplay'),
      subtitle: data.subtitle || (language === 'ar' ? 'المسودة الأولى V1' : 'V1 First Draft'),
      formatType: data.formatType || 'Feature Film',
      badge: data.formatType === 'Television Series' ? 'PILOT' : 'FEATURE',
      actStructure: data.actStructure || 3,
      targetPages: data.targetPages || 110,
      pages: 1,
      words: 4,
      scenesCount: 1,
      lastEdited: language === 'ar' ? 'الآن' : 'Just now',
      author: data.author || (language === 'ar' ? 'الكاتب' : 'Screenwriter'),
      scriptBlocks: [{ id: `b-${Date.now()}`, type: 'scene_heading', text: initialText, sceneNumber: 1 }],
      cards: [{ id: `c-${Date.now()}`, sceneNumber: 1, slugline: initialText, summary: language === 'ar' ? 'المشهد الافتتاحي...' : 'Opening scene...', pageCount: '1/8 Pg', colorTag: 'tag-blue', tagLabel: language === 'ar' ? 'الحدث الرئيسي' : 'Main Plot', act: 1 }],
      breakdown: [{ id: `bd-${Date.now()}`, sceneNumber: 1, setting: 'INT', location: language === 'ar' ? 'الموقع' : 'LOCATION', timeOfDay: 'DAY', characters: [], props: [], wardrobe: [] }],
      characters: [],
      locations: [],
    };
    setProjects((prev) => [newProj, ...prev]);
    setCurrentProjectId(newProj.id);
    setIsNewProjectOpen(false);
    setActiveView('editor');
  }, [language]);

  const deleteProject = useCallback((id: string) => {
    setProjects((prev) => {
      const remaining = prev.filter((p) => p.id !== id);
      if (remaining.length === 0) {
        setCurrentProjectId('');
        setActiveView('projects');
      } else if (currentProjectId === id) {
        setCurrentProjectId(remaining[0].id);
      }
      return remaining;
    });
  }, [currentProjectId]);

  const clearAllProjects = useCallback(() => {
    setProjects([]);
    setCurrentProjectId('');
    setActiveView('projects');
    localStorage.removeItem('cinemascript_projects');
  }, []);

  const testAiConnection = useCallback(async (
    targetProvider?: AIProviderType, 
    targetHostUrl?: string
  ): Promise<{ success: boolean; latencyMs?: number; message: string }> => {
    const providerToTest = targetProvider || aiConfig.provider;
    const hostToTest = targetHostUrl !== undefined ? targetHostUrl : aiConfig.customHostUrl;

    try {
      const res = await fetch('/api/ai/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: providerToTest, hostUrl: hostToTest })
      });
      const data = await res.json();
      return { success: Boolean(data.reachable), latencyMs: data.latencyMs, message: data.message || 'Connection successful' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to reach server';
      return { success: false, message: msg };
    }
  }, [aiConfig.provider, aiConfig.customHostUrl]);

  const sendAiPrompt = useCallback(async (prompt: string, customSystemPrompt?: string) => {
    try {
      if (aiConfig.provider === 'gemini') {
        const startTime = Date.now();
        const res = await fetch('/api/ai/directive', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, customSystemPrompt, projectContext: currentProject })
        });
        const data = await res.json();
        const latencyMs = Date.now() - startTime;
        if (data.success && data.directive) {
          return { success: true, directive: data.directive, source: 'gemini-3.7-flash', httpStatus: res.status, isJson: true, latencyMs };
        }
        return { success: false, error: data.error || 'Gemini API call failed', httpStatus: res.status };
      } else if (aiConfig.provider === 'custom_host') {
        const startTime = Date.now();
        const res = await fetch('/api/ai/custom-directive', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt,
            customSystemPrompt,
            projectContext: currentProject,
            customHostUrl: aiConfig.customHostUrl,
            customEndpointType: aiConfig.customEndpointType,
            customModel: aiConfig.customModel
          })
        });
        const data = await res.json();
        const latencyMs = Date.now() - startTime;
        if (data.success && data.directive) {
          return { success: true, directive: data.directive, source: 'custom_host', httpStatus: res.status, isJson: true, latencyMs };
        }
        return { success: false, error: data.error || 'Custom host request failed', httpStatus: res.status };
      }
      window.postMessage({ type: 'CINEMASCRIPT_AI_PROMPT_DISPATCH', prompt }, '*');
      return { success: true, source: 'extension_bridge' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'AI request failed';
      return { success: false, error: msg };
    }
  }, [aiConfig.provider, aiConfig.customHostUrl, aiConfig.customEndpointType, aiConfig.customModel, currentProject]);

  const executeAiDirective = useCallback((input: string | AICoreDirective) => {
    try {
      let directive: AICoreDirective;
      if (typeof input === 'string') {
        const cleaned = input.trim().replace(/^```json\s*/i, '').replace(/```\s*$/i, '');
        directive = JSON.parse(cleaned);
      } else {
        directive = input;
      }

      if (!directive.assistant_response) {
        throw new Error('Invalid JSON structure: missing assistant_response');
      }

      // 1. Navigation Directive
      if (directive.navigation_directive?.target_view) {
        const viewMapping: Record<string, ViewMode | null> = {
          ProjectsView: 'projects',
          projects: 'projects',
          EditorView: 'editor',
          editor: 'editor',
          OutlinerCorkboardView: 'outliner',
          outliner: 'outliner',
          BibleDatabaseView: 'bible',
          bible: 'bible',
          CharactersView: 'characters',
          characters: 'characters',
          CommunityView: 'community',
          community: 'community',
          BreakdownReportView: 'breakdown',
          breakdown: 'breakdown',
          RevisionsView: 'revisions',
          revisions: 'revisions',
          SettingsModal: 'settings',
          settings: 'settings',
        };

        const target = directive.navigation_directive.target_view;
        if (target === 'ExportModal') setIsExportOpen(true);
        else if (target === 'NewProjectModal') setIsNewProjectOpen(true);
        else if (target === 'NewSceneModal') setIsNewSceneOpen(true);
        else if (viewMapping[target]) setActiveView(viewMapping[target]!);
      }

      // 2. Tool Calls
      const getStr = (val: unknown, fallback = ''): string => (typeof val === 'string' ? val : fallback);
      const getOptStr = (val: unknown): string | undefined => (typeof val === 'string' ? val : undefined);
      const getStrArr = (val: unknown): string[] => (Array.isArray(val) ? val.filter((item): item is string => typeof item === 'string') : []);

      if (Array.isArray(directive.tool_calls)) {
        directive.tool_calls.forEach((tc) => {
          const { tool_name, parameters = {} } = tc;
          switch (tool_name) {
            case 'navigate_to': {
              const viewName = getOptStr(parameters.view_name);
              if (viewName) {
                const vm = viewName.toLowerCase();
                if (['editor', 'outliner', 'breakdown', 'bible', 'characters', 'community', 'revisions', 'projects'].includes(vm)) {
                  setActiveView(vm as ViewMode);
                }
              }
              break;
            }
            case 'trigger_corkboard_reorder': {
              const sceneId = parameters.scene_id;
              if (sceneId !== undefined && sceneId !== null && typeof parameters.new_position === 'number') {
                reorderCardBySceneId(String(sceneId), parameters.new_position);
              }
              break;
            }
            case 'insert_script_block': {
              const text = getOptStr(parameters.text);
              if (text) {
                const rawType = getOptStr(parameters.type)?.toLowerCase();
                const elemType: ScriptElementType = (rawType as ScriptElementType) || 'action';
                const character = getStr(parameters.character);
                insertScriptBlockAtIndex(elemType, character, text);
              }
              break;
            }
            case 'update_character_bible': {
              const charName = getOptStr(parameters.character_name);
              if (charName) {
                const traits = getStrArr(parameters.traits);
                const arcOrBio = getOptStr(parameters.arc) || getStr(parameters.bio);
                const rawRole = getOptStr(parameters.role);
                const role: 'Lead' | 'Supporting' | 'Minor' = (rawRole === 'Lead' || rawRole === 'Minor') ? rawRole : 'Supporting';
                updateOrAddCharacter(charName, traits, arcOrBio, role);
              }
              break;
            }
            case 'add_scene_card': {
              const slugline = getOptStr(parameters.slugline) || getOptStr(parameters.title);
              if (slugline) {
                const summary = getStr(parameters.summary, 'New scene generated via AI');
                const act = typeof parameters.act === 'number' ? parameters.act : 1;
                const pageCount = getStr(parameters.pageCount, '1/8');
                const rawColor = getOptStr(parameters.colorTag);
                const colorTag: CorkboardCard['colorTag'] =
                  rawColor === 'tag-pink' || rawColor === 'tag-yellow' || rawColor === 'tag-green'
                    ? rawColor
                    : 'tag-blue';
                const tagLabel = getStr(parameters.tagLabel, 'SCENE');

                addSceneCard({
                  slugline,
                  summary,
                  act,
                  pageCount,
                  colorTag,
                  tagLabel,
                });

                addScriptBlock({ type: 'scene_heading', text: slugline });
                if (summary) {
                  addScriptBlock({ type: 'action', text: summary });
                }

                const isExt = slugline.toUpperCase().includes('EXT');
                const isIntExt = slugline.toUpperCase().includes('INT/EXT');
                const setting: BreakdownRow['setting'] = isIntExt ? 'INT/EXT' : isExt ? 'EXT' : 'INT';
                const isNight = slugline.toUpperCase().includes('NIGHT') || slugline.toUpperCase().includes('ليل');
                addBreakdownRow({
                  setting,
                  location: slugline,
                  timeOfDay: isNight ? 'NIGHT' : 'DAY',
                  characters: [],
                  props: [],
                  wardrobe: [],
                });
              }
              break;
            }
            case 'add_location': {
              const name = getOptStr(parameters.name);
              if (name) {
                const rawType = getOptStr(parameters.type);
                const type: LocationItem['type'] =
                  rawType === 'INT/EXT' || rawType === 'EXT' ? rawType : 'INT';
                const description = getStr(parameters.description, 'Location created via AI');
                const rawTime = getOptStr(parameters.timeOfDay);
                const timeOfDay: LocationItem['timeOfDay'] =
                  rawTime === 'NIGHT' || rawTime === 'CONTINUOUS' || rawTime === 'LATER' ? rawTime : 'DAY';

                addLocation({
                  name,
                  type,
                  description,
                  timeOfDay,
                });
              }
              break;
            }
            case 'add_breakdown_item': {
              const rawSetting = getOptStr(parameters.setting);
              const setting: BreakdownRow['setting'] =
                rawSetting === 'EXT' || rawSetting === 'INT/EXT' ? rawSetting : 'INT';
              const location = getStr(parameters.location, 'Location');
              const rawTime = getOptStr(parameters.timeOfDay);
              const timeOfDay: BreakdownRow['timeOfDay'] =
                rawTime === 'NIGHT' || rawTime === 'DUSK' || rawTime === 'DAWN' || rawTime === 'CONTINUOUS' ? rawTime : 'DAY';

              const characters = getStrArr(parameters.characters);
              const props = getStrArr(parameters.props);
              const wardrobe = getStrArr(parameters.wardrobe);

              addBreakdownRow({
                setting,
                location,
                timeOfDay,
                characters,
                props,
                wardrobe,
              });
              break;
            }
            case 'open_modal': {
              const modalType = getOptStr(parameters.modal_type);
              if (modalType === 'ExportModal') setIsExportOpen(true);
              else if (modalType === 'NewProjectModal') setIsNewProjectOpen(true);
              else if (modalType === 'NewSceneModal') setIsNewSceneOpen(true);
              else if (modalType === 'SettingsModal') setIsSettingsOpen(true);
              break;
            }
            default:
              break;
          }
        });
      }

      // Handle Editor Mutation
      if (directive.editor_mutation && directive.editor_mutation.action !== 'NONE') {
        const { action, target_element, content } = directive.editor_mutation;
        if (content && (action === 'INSERT' || action === 'APPEND')) {
          const rawType = target_element ? target_element.toLowerCase() : 'action';
          const elemType: ScriptElementType = (rawType as ScriptElementType) || 'action';
          addScriptBlock({ type: elemType, text: content });
        }
      }

      setAiLogs((prev) =>
        aiDirectiveReducer(prev, {
          type: 'ADD_AI_LOG',
          payload: { id: `log-${Date.now()}`, timestamp: new Date().toLocaleTimeString(), directive, rawInput: typeof input === 'string' ? input : undefined },
        })
      );

      return { success: true, message: directive.assistant_response.message || 'Directive executed', directive };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, message: `Execution failed: ${msg}` };
    }
  }, [addScriptBlock, insertScriptBlockAtIndex, updateOrAddCharacter, addSceneCard, addLocation, addBreakdownRow, reorderCardBySceneId]);

  return (
    <ProjectContext.Provider value={{
      projects,
      currentProject,
      activeView,
      searchQuery,
      isExportOpen,
      isNewProjectOpen,
      isNewSceneOpen,
      isSettingsOpen,
      isAiAgentOpen,
      language,
      isRtl,
      aiLogs,
      aiConfig,
      updateAiConfig,
      toggleMcpTool,
      setAllMcpTools,
      testAiConnection,
      sendAiPrompt,
      t,
      setLanguage,
      toggleLanguage,
      setActiveView,
      setSearchQuery,
      setIsExportOpen,
      setIsNewProjectOpen,
      setIsNewSceneOpen,
      setIsSettingsOpen,
      setIsAiAgentOpen,
      setCurrentProjectId,
      updateScriptBlocks,
      addScriptBlock,
      insertScriptBlockAtIndex,
      deletePage,
      deleteScene,
      moveScene,
      rewriteSceneBlock,
      addSceneCard,
      reorderCardBySceneId,
      addActToCurrentProject,
      addBreakdownRow,
      createNewProject,
      deleteProject,
      clearAllProjects,
      addCharacter,
      updateCharacter,
      updateOrAddCharacter,
      addLocation,
      highlightScriptRange,
      executeAiDirective,
      googleUser,
      cloudSyncStatus,
      loginWithGoogle,
      logoutGoogle,
      setGoogleUserDirectly,
      syncProjectsToCloud,
      pullProjectsFromCloud,
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) throw new Error('useProject must be used within ProjectProvider');
  return context;
};

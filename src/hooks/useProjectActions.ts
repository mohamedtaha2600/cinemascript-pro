import { useProject } from '@/src/context/ProjectContext';

export function useProjectActions() {
  const context = useProject();

  return {
    // Navigation & UI Modals
    setActiveView: context.setActiveView,
    setSearchQuery: context.setSearchQuery,
    setIsExportOpen: context.setIsExportOpen,
    setIsNewProjectOpen: context.setIsNewProjectOpen,
    setIsNewSceneOpen: context.setIsNewSceneOpen,
    setIsSettingsOpen: context.setIsSettingsOpen,
    setIsAiAgentOpen: context.setIsAiAgentOpen,
    setCurrentProjectId: context.setCurrentProjectId,

    // Script Mutations
    updateScriptBlocks: context.updateScriptBlocks,
    addScriptBlock: context.addScriptBlock,
    insertScriptBlockAtIndex: context.insertScriptBlockAtIndex,
    deletePage: context.deletePage,
    deleteScene: context.deleteScene,
    moveScene: context.moveScene,
    rewriteSceneBlock: context.rewriteSceneBlock,
    highlightScriptRange: context.highlightScriptRange,

    // Corkboard & Production
    addSceneCard: context.addSceneCard,
    reorderCardBySceneId: context.reorderCardBySceneId,
    addBreakdownRow: context.addBreakdownRow,

    // Characters & Locations
    addCharacter: context.addCharacter,
    updateCharacter: context.updateCharacter,
    updateOrAddCharacter: context.updateOrAddCharacter,
    addLocation: context.addLocation,

    // Project Lifecycle
    createNewProject: context.createNewProject,
    deleteProject: context.deleteProject,
    clearAllProjects: context.clearAllProjects,

    // AI & MCP Engine
    executeAiDirective: context.executeAiDirective,
    sendAiPrompt: context.sendAiPrompt,
    updateAiConfig: context.updateAiConfig,
    toggleMcpTool: context.toggleMcpTool,
    setAllMcpTools: context.setAllMcpTools,
  };
}

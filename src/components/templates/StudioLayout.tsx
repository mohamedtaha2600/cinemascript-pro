import React from 'react';
import { useProject } from '@/src/context/ProjectContext';
import { useKeyboardShortcuts } from '@/src/hooks/useKeyboardShortcuts';
import { TopNavBar } from '../molecules/TopNavBar';
import { SideNavBar } from '../molecules/SideNavBar';
import { ProjectsView } from '../organisms/ProjectsView';
import { EditorView } from '../organisms/EditorView';
import { OutlinerCorkboardView } from '../organisms/OutlinerCorkboardView';
import { BreakdownReportView } from '../organisms/BreakdownReportView';
import { BibleDatabaseView } from '../organisms/BibleDatabaseView';
import { CharactersView } from '../organisms/CharactersView';
import { CommunityView } from '../organisms/CommunityView';
import { RevisionsView } from '../organisms/RevisionsView';
import { ExportModal } from '../organisms/ExportModal';
import { NewProjectModal } from '../organisms/NewProjectModal';
import { NewSceneModal } from '../organisms/NewSceneModal';
import { SettingsModal } from '../organisms/SettingsModal';
import { AICoreAgentWidget } from '../organisms/AICoreAgentWidget';
import { AiExecutionFeedbackBar } from '../molecules/AiExecutionFeedbackBar';
import { SeriesGenerationProgressBar } from '../molecules/SeriesGenerationProgressBar';
import { globalStateTracker } from '@/src/mcp/generationStateTracker';
import { Footer } from '../organisms/Footer';

export const StudioLayout: React.FC = () => {
  const {
    activeView,
    aiConfig,
    setIsAiAgentOpen,
    setIsNewSceneOpen,
    setIsExportOpen,
  } = useProject();

  useKeyboardShortcuts({
    onToggleAi: () => setIsAiAgentOpen((prev) => !prev),
    onNewScene: () => setIsNewSceneOpen(true),
  });

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0a0a0c] text-slate-100 font-sans antialiased select-none">
      <AiExecutionFeedbackBar
        activeToolName={aiConfig.lastConnectionStatus?.message || null}
        isExecuting={false}
      />

      <SeriesGenerationProgressBar progress={globalStateTracker.getProgress()} />

      <TopNavBar />

      <div className="flex-1 flex overflow-hidden relative">
        {activeView !== 'projects' && activeView !== 'community' && <SideNavBar />}

        <main className="flex-1 overflow-hidden relative">
          {activeView === 'projects' && <ProjectsView />}
          {activeView === 'editor' && <EditorView />}
          {activeView === 'outliner' && <OutlinerCorkboardView />}
          {activeView === 'breakdown' && <BreakdownReportView />}
          {activeView === 'bible' && <BibleDatabaseView />}
          {activeView === 'characters' && <CharactersView />}
          {activeView === 'community' && <CommunityView />}
          {activeView === 'revisions' && <RevisionsView />}
        </main>
      </div>

      <Footer />
      <AICoreAgentWidget />

      <ExportModal />
      <NewProjectModal />
      <NewSceneModal />
      <SettingsModal />
    </div>
  );
};

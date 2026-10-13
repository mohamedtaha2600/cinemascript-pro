import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useProject } from '@/src/context/ProjectContext';
import { CharacterSelectPopup } from '../molecules/CharacterSelectPopup';
import { SluglineSuggestPopup } from '../molecules/SluglineSuggestPopup';
import { EditorToolbar } from '../molecules/EditorToolbar';
import { EditorSceneNavigator } from '../molecules/EditorSceneNavigator';
import { ScriptElementType, ScriptBlock } from '@/src/types';
import { calculatePages } from '@/src/utils/screenplay/metrics';
import { getNextBlockType } from '@/src/utils/screenplay/parser';
import { useUndoRedo } from '@/src/hooks/useUndoRedo';
import { EditorHeader } from './editor/EditorHeader';
import { ScriptPaginationView } from './editor/ScriptPaginationView';

export const EditorView: React.FC = () => {
  const { currentProject, updateScriptBlocks } = useProject();
  const [activeLineId, setActiveLineId] = useState<string>(
    currentProject.scriptBlocks[0]?.id || 'b-1'
  );
  const [currentFormat, setCurrentFormat] = useState<ScriptElementType>('action');
  const [showCharPopup, setShowCharPopup] = useState<boolean>(false);
  const [showSluglinePopup, setShowSluglinePopup] = useState<boolean>(false);
  const [sluglineQuery, setSluglineQuery] = useState<string>('');

  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isContinuousView, setIsContinuousView] = useState<boolean>(false);
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [isNavigatorOpen, setIsNavigatorOpen] = useState<boolean>(false);

  const { state: blocks, set: setBlocks, undo, redo, canUndo, canRedo } = useUndoRedo<ScriptBlock[]>(
    currentProject.scriptBlocks
  );

  const inputRefs = useRef<{ [key: string]: HTMLTextAreaElement | HTMLInputElement | null }>({});

  useEffect(() => {
    updateScriptBlocks(blocks);
  }, [blocks, updateScriptBlocks]);

  useEffect(() => {
    const activeBlock = blocks.find((b) => b.id === activeLineId);
    if (activeBlock) setCurrentFormat(activeBlock.type);
  }, [activeLineId, blocks]);

  const focusLine = useCallback((id: string) => {
    setActiveLineId(id);
    setTimeout(() => {
      inputRefs.current[id]?.focus();
    }, 10);
  }, []);

  const handleLineChange = useCallback((id: string, text: string) => {
    const activeBlock = blocks.find((b) => b.id === id);
    let newText = text;
    if (['scene_heading', 'character', 'transition', 'shot'].includes(activeBlock?.type || '')) {
      newText = text.toUpperCase();
    }

    const updated = blocks.map((b) => (b.id === id ? { ...b, text: newText } : b));
    setBlocks(updated);

    if (text.endsWith('@') || (activeBlock?.type === 'character' && text.length > 0)) {
      setShowCharPopup(true);
    } else {
      setShowCharPopup(false);
    }

    if (activeBlock?.type === 'scene_heading') {
      setSluglineQuery(newText);
      setShowSluglinePopup(true);
    } else {
      setShowSluglinePopup(false);
    }
  }, [blocks, setBlocks]);

  const handleFormatChange = useCallback((newType: ScriptElementType) => {
    const updated = blocks.map((b) => {
      if (b.id === activeLineId) {
        let txt = b.text;
        if (newType === 'parenthetical' && !txt.startsWith('(') && txt.length > 0) {
          txt = `(${txt.replace(/^\(|\)$/g, '')})`;
        } else if (['scene_heading', 'character', 'transition', 'shot'].includes(newType)) {
          txt = txt.toUpperCase();
        }
        return { ...b, type: newType, text: txt };
      }
      return b;
    });
    setCurrentFormat(newType);
    setBlocks(updated);
    focusLine(activeLineId);
  }, [blocks, activeLineId, setBlocks, focusLine]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, block: ScriptBlock, index: number) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const nextType = getNextBlockType(block.type);
      const newBlock: ScriptBlock = {
        id: `b-${Date.now()}`,
        type: nextType,
        text: '',
      };
      const updated = [...blocks];
      updated.splice(index + 1, 0, newBlock);
      setBlocks(updated);
      focusLine(newBlock.id);
    }
  }, [blocks, setBlocks, focusLine]);

  const pages = calculatePages(blocks);

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c]">
      <EditorHeader
        title={currentProject.title}
        zoomLevel={zoomLevel}
        isContinuousView={isContinuousView}
        isFocusMode={isFocusMode}
        isNavigatorOpen={isNavigatorOpen}
        canUndo={canUndo}
        canRedo={canRedo}
        onZoomChange={(d) => setZoomLevel((z) => Math.max(50, Math.min(150, z + d)))}
        onToggleContinuous={() => setIsContinuousView((v) => !v)}
        onToggleFocus={() => setIsFocusMode((v) => !v)}
        onToggleNavigator={() => setIsNavigatorOpen((v) => !v)}
        onUndo={undo}
        onRedo={redo}
      />

      <EditorToolbar currentFormat={currentFormat} onFormatChange={handleFormatChange} />

      <div className="relative flex flex-1 overflow-hidden">
        {isNavigatorOpen && (
          <EditorSceneNavigator
            blocks={blocks}
            activeLineId={activeLineId}
            onSelectScene={(id) => focusLine(id)}
          />
        )}

        <div className="flex-1 overflow-y-auto p-8">
          <ScriptPaginationView
            pages={pages}
            activeLineId={activeLineId}
            isFocusMode={isFocusMode}
            isContinuousView={isContinuousView}
            zoomLevel={zoomLevel}
            onFocus={focusLine}
            onChange={handleLineChange}
            onKeyDown={handleKeyDown}
            inputRef={(id, el) => { inputRefs.current[id] = el; }}
          />

          {showCharPopup && (
            <CharacterSelectPopup
              characters={currentProject.characters.map((c) => ({ name: c.name.toUpperCase(), role: 'LEAD' }))}
              onSelect={(name) => {
                handleLineChange(activeLineId, name);
                setShowCharPopup(false);
              }}
              onClose={() => setShowCharPopup(false)}
            />
          )}

          {showSluglinePopup && (
            <SluglineSuggestPopup
              query={sluglineQuery}
              onSelect={(slug) => {
                handleLineChange(activeLineId, slug);
                setShowSluglinePopup(false);
              }}
              onClose={() => setShowSluglinePopup(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

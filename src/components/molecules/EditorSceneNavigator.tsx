import React, { useEffect } from 'react';
import { useProject } from '@/src/context/ProjectContext';
import { Icon } from '../atoms/Icon';
import { ScriptBlock } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';

export interface EditorSceneNavigatorProps {
  isOpen?: boolean;
  onClose?: () => void;
  blocks: ScriptBlock[];
  onSelectScene: (blockId: string) => void;
  onAddScene?: () => void;
  activeLineId?: string;
}

export const EditorSceneNavigator: React.FC<EditorSceneNavigatorProps> = ({
  isOpen = true,
  onClose,
  blocks,
  onSelectScene,
  onAddScene
}) => {
  const { t, isRtl, language } = useTranslation();
  const { projects, currentProject, setIsNewProjectOpen } = useProject();

  const handleAddSceneClick = () => {
    if (projects.length === 0 || !currentProject?.id || currentProject.id === 'blank-proj') {
      setIsNewProjectOpen(true);
      return;
    }
    onAddScene?.();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const sceneHeadings = blocks.filter(b => b.type === 'scene_heading');

  return (
    <aside className={`w-80 bg-[#121414] border-r ${isRtl ? 'border-l border-r-0' : 'border-r'} border-[#333535] flex flex-col h-full shrink-0 z-20 shadow-2xl transition-all`}>
      {/* Header */}
      <div className="p-4 border-b border-[#333535] flex items-center justify-between bg-[#1a1c1c]">
        <div className="flex items-center gap-2">
          <Icon name="format_list_numbered" size={18} className="text-[#ff5708]" />
          <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            {t('sceneNavigator')} ({sceneHeadings.length})
          </h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-[#e5beb2] hover:text-white cursor-pointer p-1 rounded hover:bg-[#333535]"
          >
            <Icon name="close" size={16} />
          </button>
        )}
      </div>

      {/* Quick Add Scene */}
      {onAddScene && (
        <div className="p-3 border-b border-[#333535] bg-[#0c0f0f]">
          <button
            onClick={handleAddSceneClick}
            className="w-full bg-[#ff5708] hover:bg-[#ffb59c] text-black font-mono text-xs font-bold py-2 px-3 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Icon name="add" size={16} />
            <span>{t('addNewScene')}</span>
          </button>
        </div>
      )}

      {/* Scene List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {sceneHeadings.length === 0 ? (
          <div className="p-4 text-center text-xs font-mono text-[#e5beb2]">
            {t('noSceneHeadings')}
          </div>
        ) : (
          sceneHeadings.map((scene, idx) => {
            const isInt = scene.text.includes('INT') || scene.text.includes('داخلي');
            return (
              <div
                key={scene.id}
                onClick={() => onSelectScene(scene.id)}
                className="p-3 bg-[#1a1c1c] hover:bg-[#252828] border border-[#333535] hover:border-[#ff5708] transition-all cursor-pointer group rounded-lg"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] text-[#ff5708] font-bold">
                    {language === 'ar' ? `مشهد ${idx + 1}` : `SCENE ${idx + 1}`}
                  </span>
                  <span className={`font-mono text-[9px] px-1.5 py-0.5 border rounded ${isInt ? 'border-[#3b82f6]/40 text-[#60a5fa] bg-[#3b82f6]/10' : 'border-[#10b981]/40 text-[#34d399] bg-[#10b981]/10'}`}>
                    {isInt ? (language === 'ar' ? 'داخلي' : 'INT') : (language === 'ar' ? 'خارجي' : 'EXT')}
                  </span>
                </div>
                <p className="font-mono text-xs text-white uppercase line-clamp-1 font-bold group-hover:text-[#ffb59c] transition-colors">
                  {scene.text || (language === 'ar' ? '[مشهد بدون عنوان]' : '[UNTITLED SCENE]')}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Footer statistics */}
      <div className="p-3 bg-[#0c0f0f] border-t border-[#333535] text-[10px] font-mono text-[#e5beb2] flex justify-between">
        <span>{sceneHeadings.length} {t('scenes')}</span>
        <span>~{sceneHeadings.length * 1.5} {t('minsRunTime')}</span>
      </div>
    </aside>
  );
};

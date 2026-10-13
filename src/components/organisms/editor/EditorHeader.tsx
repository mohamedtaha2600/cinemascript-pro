import React from 'react';
import { Button, Badge } from '@/src/components/atoms';
import { Eye, Focus, ZoomIn, ZoomOut, RotateCcw, RotateCw, MapPin } from 'lucide-react';
import { useTranslation } from '@/src/hooks/useTranslation';

export interface EditorHeaderProps {
  title: string;
  zoomLevel: number;
  isContinuousView: boolean;
  isFocusMode: boolean;
  isNavigatorOpen: boolean;
  canUndo: boolean;
  canRedo: boolean;
  onZoomChange: (delta: number) => void;
  onToggleContinuous: () => void;
  onToggleFocus: () => void;
  onToggleNavigator: () => void;
  onUndo: () => void;
  onRedo: () => void;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
  title,
  zoomLevel,
  isContinuousView,
  isFocusMode,
  isNavigatorOpen,
  canUndo,
  canRedo,
  onZoomChange,
  onToggleContinuous,
  onToggleFocus,
  onToggleNavigator,
  onUndo,
  onRedo,
}) => {
  const { t, language } = useTranslation();

  return (
    <div className="flex items-center justify-between border-b border-slate-800/80 bg-[#0a0a0c]/90 px-6 py-2.5 backdrop-blur-xl shrink-0 select-none">
      <div className="flex items-center space-x-3 rtl:space-x-reverse">
        <h2 className="font-bold text-slate-100 text-base tracking-tight truncate max-w-xs">
          {title || (language === 'ar' ? 'سيناريو بدون عنوان' : 'Untitled Screenplay')}
        </h2>
        <Badge variant="primary">{t('studioEditor')}</Badge>
      </div>

      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <Button variant="outline" size="sm" onClick={onUndo} disabled={!canUndo} title={`${t('undo')} (Ctrl+Z)`}>
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
        <Button variant="outline" size="sm" onClick={onRedo} disabled={!canRedo} title={`${t('redo')} (Ctrl+Y)`}>
          <RotateCw className="h-3.5 w-3.5" />
        </Button>

        <div className="h-4 w-[1px] bg-slate-800 my-auto" />

        <Button variant={isContinuousView ? 'primary' : 'outline'} size="sm" onClick={onToggleContinuous} title={t('continuousView')}>
          <Eye className="h-3.5 w-3.5" />
        </Button>
        <Button variant={isFocusMode ? 'primary' : 'outline'} size="sm" onClick={onToggleFocus} title={t('focusMode')}>
          <Focus className="h-3.5 w-3.5" />
        </Button>
        <Button variant={isNavigatorOpen ? 'primary' : 'outline'} size="sm" onClick={onToggleNavigator} title={t('sceneNavigator')}>
          <MapPin className="h-3.5 w-3.5" />
        </Button>

        <div className="h-4 w-[1px] bg-slate-800 my-auto" />

        <div className="flex items-center space-x-1 rtl:space-x-reverse rounded-lg bg-slate-900 px-1.5 py-0.5 border border-slate-800">
          <button onClick={() => onZoomChange(-10)} className="p-1 text-slate-400 hover:text-white" title={t('zoomOut')}>
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <span className="font-mono text-[11px] font-bold text-amber-400 px-1.5">{zoomLevel}%</span>
          <button onClick={() => onZoomChange(10)} className="p-1 text-slate-400 hover:text-white" title={t('zoomIn')}>
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

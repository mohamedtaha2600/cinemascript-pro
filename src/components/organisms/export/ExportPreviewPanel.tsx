import React from 'react';
import { ProjectData } from '@/src/types';

export interface ExportPreviewPanelProps {
  project: ProjectData;
  includeTitlePage: boolean;
}

export const ExportPreviewPanel: React.FC<ExportPreviewPanelProps> = ({ project, includeTitlePage }) => {
  return (
    <div className="rounded-lg bg-slate-950 p-4 border border-slate-800 font-mono text-xs text-slate-300 max-h-44 overflow-y-auto">
      {includeTitlePage && (
        <div className="text-center border-b border-slate-800 pb-3 mb-3">
          <p className="font-bold text-amber-400 text-sm">{project.title.toUpperCase()}</p>
          <p className="text-slate-400 text-[10px]">{project.subtitle}</p>
          <p className="text-slate-500 text-[10px] mt-2">Written by {project.author}</p>
        </div>
      )}

      <div className="space-y-1">
        {project.scriptBlocks.slice(0, 6).map((b) => (
          <p key={b.id} className={b.type === 'scene_heading' ? 'font-bold text-amber-300' : 'text-slate-400'}>
            {b.text}
          </p>
        ))}
        {project.scriptBlocks.length > 6 && (
          <p className="text-slate-600 italic text-[10px] pt-1">... ({project.scriptBlocks.length - 6} more blocks)</p>
        )}
      </div>
    </div>
  );
};

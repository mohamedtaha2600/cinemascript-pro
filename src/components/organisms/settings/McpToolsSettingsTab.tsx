import React from 'react';
import { CINEMASCRIPT_MCP_TOOLS } from '@/src/data/mcpTools';
import { ShieldCheck, ToggleLeft, ToggleRight } from 'lucide-react';

export interface McpToolsSettingsTabProps {
  enabledTools: string[];
  onToggleTool: (id: string) => void;
  onSetAll: (enabled: boolean) => void;
}

export const McpToolsSettingsTab: React.FC<McpToolsSettingsTabProps> = ({
  enabledTools,
  onToggleTool,
  onSetAll,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <h4 className="font-bold text-xs text-slate-200 uppercase tracking-wider">
            MCP TOOL CATALOG & PERMISSIONS ({enabledTools.length}/{CINEMASCRIPT_MCP_TOOLS.length})
          </h4>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onSetAll(true)}
            className="text-[10px] text-amber-400 hover:underline font-mono"
          >
            Enable All
          </button>
          <span className="text-slate-600">•</span>
          <button
            onClick={() => onSetAll(false)}
            className="text-[10px] text-slate-500 hover:underline font-mono"
          >
            Disable All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
        {CINEMASCRIPT_MCP_TOOLS.map((tool) => {
          const isEnabled = enabledTools.includes(tool.id);
          return (
            <div
              key={tool.id}
              onClick={() => onToggleTool(tool.id)}
              className={`flex items-center justify-between rounded p-2.5 cursor-pointer border transition-all ${
                isEnabled
                  ? 'bg-slate-900 border-amber-500/30 text-slate-200'
                  : 'bg-slate-950 border-slate-900 text-slate-500 opacity-60'
              }`}
            >
              <div className="min-w-0 pr-2">
                <p className="font-mono font-bold text-xs truncate">{tool.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{tool.descriptionAr}</p>
              </div>

              {isEnabled ? (
                <ToggleRight className="h-5 w-5 text-amber-400 shrink-0" />
              ) : (
                <ToggleLeft className="h-5 w-5 text-slate-600 shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

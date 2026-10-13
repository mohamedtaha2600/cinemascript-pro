import React from 'react';
import { useTranslation } from '@/src/hooks/useTranslation';
import { AIConnectionConfig } from '@/src/types';
import { Zap, Server, ShieldCheck } from 'lucide-react';

export interface AgentMcpStatusBadgeProps {
  config: AIConnectionConfig;
  onOpenSettings: () => void;
}

export const AgentMcpStatusBadge: React.FC<AgentMcpStatusBadgeProps> = ({ config, onOpenSettings }) => {
  const { language } = useTranslation();
  const isGemini = config.provider === 'gemini';

  return (
    <div
      onClick={onOpenSettings}
      className="flex items-center space-x-2 rtl:space-x-reverse rounded-full bg-slate-900/80 px-3 py-1 text-xs border border-slate-700/50 hover:border-amber-500/50 cursor-pointer transition-all select-none"
    >
      {isGemini ? (
        <Zap className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
      ) : (
        <Server className="h-3.5 w-3.5 text-blue-400" />
      )}
      <span className="font-semibold text-slate-200">
        {isGemini
          ? (language === 'ar' ? 'محرك Gemini 3.7 السحابي' : 'Gemini 3.7 Cloud Engine')
          : (language === 'ar' ? 'جسر خادم Cloudflare MCP' : 'Cloudflare MCP Bridge Host')}
      </span>
      <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
    </div>
  );
};

import React from 'react';
import { AIProviderType } from '@/src/types';
import { Zap, Server, ShieldCheck } from 'lucide-react';
import { Button } from '@/src/components/atoms';

export interface AiProviderSettingsTabProps {
  provider: AIProviderType;
  customHostUrl: string;
  autoExecute: boolean;
  testing: boolean;
  testResult: { success: boolean; latencyMs?: number; message: string } | null;
  onProviderChange: (p: AIProviderType) => void;
  onHostUrlChange: (url: string) => void;
  onAutoExecuteChange: (val: boolean) => void;
  onTestConnection: () => void;
}

export const AiProviderSettingsTab: React.FC<AiProviderSettingsTabProps> = ({
  provider,
  customHostUrl,
  autoExecute,
  testing,
  testResult,
  onProviderChange,
  onHostUrlChange,
  onAutoExecuteChange,
  onTestConnection,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-amber-400 uppercase mb-2">AI ENGINE PROVIDER</label>
        <div className="grid grid-cols-2 gap-3">
          <div
            onClick={() => onProviderChange('gemini')}
            className={`flex items-center space-x-3 rounded-lg p-3 cursor-pointer border transition-all ${
              provider === 'gemini' ? 'bg-amber-500/10 border-amber-500 text-slate-100' : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <Zap className="h-5 w-5 text-amber-400" />
            <div>
              <h4 className="font-bold text-sm">Gemini 3.7 Flash Cloud</h4>
              <p className="text-[10px] text-slate-500">Official High-Speed AI Engine</p>
            </div>
          </div>

          <div
            onClick={() => onProviderChange('custom_host')}
            className={`flex items-center space-x-3 rounded-lg p-3 cursor-pointer border transition-all ${
              provider === 'custom_host' ? 'bg-blue-500/10 border-blue-500 text-slate-100' : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <Server className="h-5 w-5 text-blue-400" />
            <div>
              <h4 className="font-bold text-sm">Cloudflare / Custom Host</h4>
              <p className="text-[10px] text-slate-500">Localhost or Tunnel Proxy</p>
            </div>
          </div>
        </div>
      </div>

      {provider === 'custom_host' && (
        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1">TUNNEL / HOST URL</label>
          <input
            type="text"
            value={customHostUrl}
            onChange={(e) => onHostUrlChange(e.target.value)}
            placeholder="https://your-tunnel.trycloudflare.com"
            className="w-full rounded bg-slate-900 px-3 py-2 text-xs text-slate-100 border border-slate-800 outline-none focus:border-blue-500"
          />
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={autoExecute}
            onChange={(e) => onAutoExecuteChange(e.target.checked)}
            className="rounded border-slate-700 text-amber-500 focus:ring-0"
          />
          <span>Auto-execute AI Directives & MCP Tool Calls</span>
        </label>

        <Button variant="outline" size="sm" onClick={onTestConnection} disabled={testing}>
          {testing ? 'Testing...' : 'Test Connection'}
        </Button>
      </div>

      {testResult && (
        <div
          className={`flex items-center space-x-2 rounded p-2 text-xs font-mono border ${
            testResult.success ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          <span>{testResult.message} {testResult.latencyMs ? `(${testResult.latencyMs}ms)` : ''}</span>
        </div>
      )}
    </div>
  );
};

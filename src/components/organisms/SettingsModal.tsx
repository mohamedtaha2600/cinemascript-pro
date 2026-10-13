import React, { useState, useEffect, useCallback } from 'react';
import { useProject } from '@/src/context/ProjectContext';
import { useTranslation } from '@/src/hooks/useTranslation';
import { X, Settings, Check } from 'lucide-react';
import { Button } from '@/src/components/atoms';
import { AIProviderType } from '@/src/types';
import { DEFAULT_ENABLED_MCP_TOOL_IDS } from '@/src/data/mcpTools';
import { AiProviderSettingsTab } from './settings/AiProviderSettingsTab';
import { McpToolsSettingsTab } from './settings/McpToolsSettingsTab';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    aiConfig,
    updateAiConfig,
    testAiConnection,
    toggleMcpTool,
    setAllMcpTools,
  } = useProject();

  const { t, language } = useTranslation();
  const [activeTab, setActiveTab] = useState<'AI' | 'MCP'>('AI');
  const [provider, setProvider] = useState<AIProviderType>(aiConfig.provider || 'gemini');
  const [customHostUrl, setCustomHostUrl] = useState(
    aiConfig.customHostUrl || 'https://hit-contemporary-favour-dating.trycloudflare.com'
  );
  const [autoExecute, setAutoExecute] = useState(aiConfig.autoExecuteDirectives !== false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; latencyMs?: number; message: string } | null>(
    aiConfig.lastConnectionStatus ? {
      success: aiConfig.lastConnectionStatus.success,
      latencyMs: aiConfig.lastConnectionStatus.latencyMs,
      message: aiConfig.lastConnectionStatus.message || 'Ready'
    } : null
  );
  const [savedNotice, setSavedNotice] = useState(false);

  const handleClose = useCallback(() => {
    setIsSettingsOpen(false);
  }, [setIsSettingsOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSettingsOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSettingsOpen, handleClose]);

  if (!isSettingsOpen) return null;

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await testAiConnection(provider, customHostUrl);
      setTestResult(res);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Test failed';
      setTestResult({ success: false, message: msg });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    updateAiConfig({
      provider,
      customHostUrl,
      autoExecuteDirectives: autoExecute,
    });
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      setIsSettingsOpen(false);
    }, 800);
  };

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 select-none font-sans"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl rounded-2xl bg-[#0f1015] p-6 border border-amber-500/30 shadow-2xl space-y-6"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-lg">
                {language === 'ar' ? 'إعدادات الاستوديو ومحرك الـ MCP' : 'Studio & MCP Engine Configuration'}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {language === 'ar' ? 'إدارة مزودي الذكاء الاصطناعي، خوادم Cloudflare، وأدوات MCP' : 'Manage AI providers, Cloudflare Tunnels & MCP Tools'}
              </p>
            </div>
          </div>
          <button onClick={handleClose} className="text-slate-400 hover:text-white p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex border-b border-slate-800 space-x-4 rtl:space-x-reverse text-xs font-mono">
          <button
            onClick={() => setActiveTab('AI')}
            className={`pb-2 transition-colors ${
              activeTab === 'AI' ? 'border-b-2 border-amber-400 text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'ar' ? 'مزود الخدمة والمستضيف' : 'AI PROVIDER & HOST'}
          </button>
          <button
            onClick={() => setActiveTab('MCP')}
            className={`pb-2 transition-colors ${
              activeTab === 'MCP' ? 'border-b-2 border-amber-400 text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'ar' ? 'كتالوج أدوات الـ MCP' : 'MCP TOOLS CATALOG'}
          </button>
        </div>

        {activeTab === 'AI' ? (
          <AiProviderSettingsTab
            provider={provider}
            customHostUrl={customHostUrl}
            autoExecute={autoExecute}
            testing={testing}
            testResult={testResult}
            onProviderChange={setProvider}
            onHostUrlChange={setCustomHostUrl}
            onAutoExecuteChange={setAutoExecute}
            onTestConnection={handleTestConnection}
          />
        ) : (
          <McpToolsSettingsTab
            enabledTools={aiConfig.enabledMcpTools || DEFAULT_ENABLED_MCP_TOOL_IDS}
            onToggleTool={toggleMcpTool}
            onSetAll={setAllMcpTools}
          />
        )}

        <div className="flex items-center justify-between border-t border-slate-800 pt-4">
          {savedNotice ? (
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs font-mono text-emerald-400">
              <Check className="h-4 w-4" />
              <span>{language === 'ar' ? 'تم حفظ الإعدادات بنجاح!' : 'Settings Saved Successfully!'}</span>
            </div>
          ) : (
            <span className="text-[10px] text-slate-500 font-mono">CinemaScript Studio Engine v2.5</span>
          )}

          <div className="flex space-x-2 rtl:space-x-reverse">
            <Button variant="outline" onClick={handleClose}>
              {t('cancel')}
            </Button>
            <Button variant="primary" onClick={handleSave}>
              {language === 'ar' ? 'حفظ التكوين' : 'Save Configuration'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

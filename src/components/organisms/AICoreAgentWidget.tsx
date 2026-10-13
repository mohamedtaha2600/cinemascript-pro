import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useProject } from '@/src/context/ProjectContext';
import { useOnClickOutside } from '@/src/hooks/useOnClickOutside';
import { X, Sparkles, SlidersHorizontal, Trash2 } from 'lucide-react';
import { AgentMcpStatusBadge } from './aiAgent/AgentMcpStatusBadge';
import { AgentChatMessages, ChatMessage } from './aiAgent/AgentChatMessages';
import { AgentInputPanel } from './aiAgent/AgentInputPanel';
import { ProjectSetupData } from './aiAgent/AiProjectSetupQuestionCard';

export const AICoreAgentWidget: React.FC = () => {
  const {
    isAiAgentOpen,
    setIsAiAgentOpen,
    executeAiDirective,
    aiConfig,
    sendAiPrompt,
    setIsSettingsOpen,
    language,
    projects,
    currentProject,
    createNewProject,
    setActiveView,
  } = useProject();

  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const widgetRef = useRef<HTMLDivElement | null>(null);

  const hasNoRealProject = projects.length === 0 || !currentProject?.id || currentProject.id === 'blank-proj';

  const handleClose = useCallback(() => {
    setIsAiAgentOpen(false);
  }, [setIsAiAgentOpen]);

  useOnClickOutside(widgetRef, handleClose, isAiAgentOpen);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAiAgentOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAiAgentOpen, handleClose]);

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: language === 'ar'
        ? 'أهلاً بك يا فنان في CinemaScript Pro. محرك الذكاء الاصطناعي متصل وجاهز للعمل. يمكنك إرسال أي أمر سينمائي لبناء المشاهد، إعادة ترتيب الكورك بورد، أو التحكم بالنظام.'
        : 'Welcome to CinemaScript Pro. AI Autonomous Core is online and ready.',
      thought: 'Engine ready. Connected to MCP execution bus.',
      source: aiConfig.provider === 'gemini' ? 'Gemini 3.7 Cloud' : 'Cloudflare Tunnel',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading]);

  const handleClearHistory = () => {
    setChatHistory([
      {
        id: `init-${Date.now()}`,
        sender: 'ai',
        text: language === 'ar'
          ? 'تم مسح السجل. أنا جاهز لتلقي أوامرك السينمائية الجديدة.'
          : 'Chat history cleared. Ready for new screenplay directives.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleConfirmProjectSetup = async (data: ProjectSetupData) => {
    setIsLoading(true);

    createNewProject({
      title: data.title,
      subtitle: language === 'ar' ? 'المسودة الأولى V1' : 'V1 Production Draft',
      formatType: data.format,
      actStructure: data.acts,
      targetPages: data.targetPages,
    });

    const confirmMsg: ChatMessage = {
      id: `ai-setup-${Date.now()}`,
      sender: 'ai',
      text: language === 'ar'
        ? `✨ تم إنشاء المشروع "${data.title}" بنجاح! جاري توليد المشاهد المطلوبة وكتابة النص السينمائي...`
        : `✨ Project "${data.title}" initialized successfully! Generating requested scenes now...`,
      thought: `Initialized project '${data.title}' with ${data.acts} Acts and format '${data.format}'.`,
      source: 'MCP System Engine',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatHistory((prev) => [...prev, confirmMsg]);
    setActiveView('editor');

    if (data.userPromptText) {
      try {
        const res = await sendAiPrompt(data.userPromptText);
        if (res.success && res.directive) {
          executeAiDirective(res.directive);
          const aiMsg: ChatMessage = {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: res.directive.assistant_response?.message || (language === 'ar' ? 'تم تنفيذ الأمر وبناء المشهد بنجاح.' : 'Directive executed and scene built successfully.'),
            thought: res.directive.assistant_response?.ui_thought_process,
            source: res.source,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setChatHistory((prev) => [...prev, aiMsg]);
        }
      } catch (e: unknown) {
        console.error('AI Directive Error post setup:', e);
      }
    }

    setIsLoading(false);
  };

  const handleSubmitPrompt = async (promptText: string) => {
    if (!promptText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatHistory((prev) => [...prev, userMsg]);

    if (hasNoRealProject) {
      const cardMsg: ChatMessage = {
        id: `setup-card-${Date.now()}`,
        sender: 'ai',
        text: language === 'ar'
          ? 'لاحظت أنه لا يوجد مشروع نشط مفتوح حالياً. يرجى تأكيد إعدادات المشروع أدناه لإنشائه وبدء المشهد تلقائياً:'
          : 'Notice: No active project is currently loaded. Please configure project setup below to initialize:',
        isSetupCard: true,
        setupPromptText: promptText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatHistory((prev) => [...prev, cardMsg]);
      return;
    }

    setIsLoading(true);

    try {
      const res = await sendAiPrompt(promptText);
      if (res.success && res.directive) {
        executeAiDirective(res.directive);
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: res.directive.assistant_response?.message || (language === 'ar' ? 'تم تنفيذ الأمر بنجاح.' : 'Directive executed successfully.'),
          thought: res.directive.assistant_response?.ui_thought_process,
          source: res.source,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setChatHistory((prev) => [...prev, aiMsg]);
      } else {
        const errorMsg: ChatMessage = {
          id: `err-${Date.now()}`,
          sender: 'ai',
          text: `⚠️ ${language === 'ar' ? 'تعذر معالجة الطلب:' : 'Failed to process request:'} ${res.error || (language === 'ar' ? 'خطأ غير معروف' : 'Unknown error')}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setChatHistory((prev) => [...prev, errorMsg]);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setChatHistory((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'ai',
          text: `⚠️ ${language === 'ar' ? 'خطأ في الاتصال:' : 'Connection error:'} ${msg}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmitPrompt(userInput);
    setUserInput('');
  };

  if (!isAiAgentOpen) {
    return (
      <button
        onClick={() => setIsAiAgentOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-black shadow-2xl shadow-amber-500/30 hover:scale-110 active:scale-95 transition-all cursor-pointer border border-amber-300/40 group select-none"
        title={language === 'ar' ? 'فتح مساعد الذكاء الاصطناعي (Ctrl+K)' : 'Open CinemaScript AI Assistant (Ctrl+K)'}
      >
        <Sparkles className="h-6 w-6 group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500" />
        </span>
      </button>
    );
  }

  return (
    <div
      ref={widgetRef}
      className="fixed bottom-6 right-6 z-50 flex h-[630px] w-[460px] flex-col overflow-hidden rounded-2xl bg-[#0f1015]/95 border border-amber-500/30 shadow-2xl backdrop-blur-2xl transition-all select-none font-sans"
    >
      <div className="flex items-center justify-between border-b border-slate-800/80 bg-[#14161f]/90 px-4 py-3">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-sm">CinemaScript AI Core</h3>
            <p className="text-[10px] text-slate-400 font-mono">
              {language === 'ar' ? 'محرك الـ MCP الاستقلالي' : 'Autonomous MCP Agent'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
          <AgentMcpStatusBadge config={aiConfig} onOpenSettings={() => setIsSettingsOpen(true)} />
          <button
            onClick={handleClearHistory}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
            title={language === 'ar' ? 'مسح سجل المحادثة' : 'Clear Chat History'}
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={language === 'ar' ? 'إعدادات أداة MCP' : 'MCP Tool Settings'}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={language === 'ar' ? 'إغلاق (Esc)' : 'Close (Esc)'}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <AgentChatMessages
        messages={chatHistory}
        isLoading={isLoading}
        messagesEndRef={messagesEndRef}
        onConfirmSetup={handleConfirmProjectSetup}
      />

      <AgentInputPanel
        input={userInput}
        isLoading={isLoading}
        onChange={setUserInput}
        onSubmit={handleFormSubmit}
        onQuickChipClick={(chipText) => handleSubmitPrompt(chipText)}
      />
    </div>
  );
};

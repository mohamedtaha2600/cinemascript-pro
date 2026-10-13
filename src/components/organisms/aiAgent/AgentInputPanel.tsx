import React from 'react';
import { useTranslation } from '@/src/hooks/useTranslation';
import { Send, Sparkles, Command } from 'lucide-react';
import { Button } from '@/src/components/atoms';

export interface AgentInputPanelProps {
  input: string;
  isLoading: boolean;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onQuickChipClick?: (text: string) => void;
}

export const AgentInputPanel: React.FC<AgentInputPanelProps> = ({
  input,
  isLoading,
  onChange,
  onSubmit,
  onQuickChipClick,
}) => {
  const { t, language } = useTranslation();

  const quickChips = language === 'ar' ? [
    '⚡ مشهد جديد في المقهى',
    '🔍 تدقيق الحبكة الدرامية',
    '🎭 إضافة شخصية جديدة',
    '📊 حساب عدد المشاهد والصفحات',
  ] : [
    '⚡ New Diner Scene',
    '🔍 Audit Story Beat Sheet',
    '🎭 Add Lead Character Profile',
    '📊 Count Scenes & Pages',
  ];

  return (
    <div className="border-t border-slate-800/80 bg-[#0f1015]/95 p-4 space-y-3 backdrop-blur-xl shrink-0 select-none font-sans">
      <div className="flex space-x-2 rtl:space-x-reverse overflow-x-auto pb-1 scrollbar-none">
        {quickChips.map((chip, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onQuickChipClick?.(chip)}
            className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-mono text-slate-300 border border-slate-800 hover:border-amber-500/40 hover:text-amber-400 transition-all shrink-0 cursor-pointer"
          >
            {chip}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="flex items-center space-x-2 rtl:space-x-reverse">
        <div className="relative flex-1">
          <input
            type="text"
            autoFocus
            value={input}
            onChange={(e) => onChange(e.target.value)}
            disabled={isLoading}
            placeholder={language === 'ar' ? 'اكتب أمراً سينمائياً للمساعد الذكي...' : 'Type a screenplay directive...'}
            className="w-full rounded-xl bg-slate-900/90 pl-4 pr-9 py-2.5 text-xs font-mono text-slate-100 placeholder-slate-500 border border-slate-800 outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/20 transition-all"
          />
          <Sparkles className="absolute right-3 top-3 h-3.5 w-3.5 text-amber-400 pointer-events-none" />
        </div>

        <Button type="submit" disabled={isLoading || !input.trim()} variant="primary" size="sm" className="h-9 px-4">
          <Send className="h-3.5 w-3.5" />
        </Button>
      </form>

      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 px-1">
        <span className="flex items-center space-x-1 rtl:space-x-reverse">
          <Command className="h-3 w-3 text-amber-400" />
          <span>{language === 'ar' ? 'اضغط Enter للإرسال' : 'Press Enter to send'}</span>
        </span>
        <span>CinemaScript MCP Core</span>
      </div>
    </div>
  );
};

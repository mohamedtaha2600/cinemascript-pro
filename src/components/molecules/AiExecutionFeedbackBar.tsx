import React from 'react';
import { useTranslation } from '@/src/hooks/useTranslation';
import { Bot, Loader2 } from 'lucide-react';

export interface AiExecutionFeedbackBarProps {
  activeToolName: string | null;
  isExecuting: boolean;
}

export const AiExecutionFeedbackBar: React.FC<AiExecutionFeedbackBarProps> = ({
  activeToolName,
  isExecuting,
}) => {
  const { language } = useTranslation();

  if (!isExecuting || !activeToolName) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center space-x-3 rtl:space-x-reverse rounded-full bg-amber-500/90 text-black px-4 py-2 text-xs font-mono font-bold shadow-2xl backdrop-blur-md animate-bounce border border-amber-400 select-none">
      <Bot className="h-4 w-4" />
      <span>
        {language === 'ar' ? `جاري تنفيذ أمر الذكاء الاصطناعي: ${activeToolName}` : `AI MCP EXECUTING: ${activeToolName}`}
      </span>
      <Loader2 className="h-3.5 w-3.5 animate-spin" />
    </div>
  );
};

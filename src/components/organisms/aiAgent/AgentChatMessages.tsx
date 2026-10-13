import React, { useState } from 'react';
import { Bot, User, Cpu, ChevronDown, ChevronRight, CheckCircle2 } from 'lucide-react';
import { AiProjectSetupQuestionCard, ProjectSetupData } from './AiProjectSetupQuestionCard';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  thought?: string;
  tools?: string[];
  source?: string;
  timestamp: string;
  isSetupCard?: boolean;
  setupPromptText?: string;
}

export interface AgentChatMessagesProps {
  messages: ChatMessage[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  onConfirmSetup?: (data: ProjectSetupData) => void;
}

export const AgentChatMessages: React.FC<AgentChatMessagesProps> = ({
  messages,
  isLoading,
  messagesEndRef,
  onConfirmSetup,
}) => {
  const [expandedThoughtId, setExpandedThoughtId] = useState<string | null>(null);

  const toggleThought = (id: string) => {
    setExpandedThoughtId(expandedThoughtId === id ? null : id);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono select-text font-sans">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
        >
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl shadow-md ${
              msg.sender === 'user'
                ? 'bg-blue-600 text-white shadow-blue-500/20'
                : 'bg-gradient-to-br from-amber-400 to-amber-600 text-black font-bold shadow-amber-500/20'
            }`}
          >
            {msg.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
          </div>

          <div
            className={`max-w-[88%] rounded-2xl p-4 text-xs leading-relaxed border backdrop-blur-xl ${
              msg.sender === 'user'
                ? 'bg-blue-600/10 border-blue-500/30 text-blue-100 rounded-tr-none'
                : 'bg-slate-900/90 border-slate-800 text-slate-200 rounded-tl-none shadow-xl'
            }`}
          >
            {msg.thought && (
              <div className="mb-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-2.5">
                <button
                  type="button"
                  onClick={() => toggleThought(msg.id)}
                  className="flex w-full items-center justify-between text-[11px] font-bold text-amber-400 cursor-pointer"
                >
                  <span className="flex items-center space-x-1.5 rtl:space-x-reverse">
                    <Cpu className="h-3.5 w-3.5" />
                    <span>SYSTEM REASONING LOG</span>
                  </span>
                  {expandedThoughtId === msg.id ? (
                    <ChevronDown className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5" />
                  )}
                </button>
                {expandedThoughtId === msg.id && (
                  <p className="mt-2 text-[10px] text-amber-300/80 leading-relaxed font-mono whitespace-pre-wrap border-t border-amber-500/10 pt-2">
                    {msg.thought}
                  </p>
                )}
              </div>
            )}

            <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>

            {msg.isSetupCard && onConfirmSetup && (
              <AiProjectSetupQuestionCard
                initialPromptText={msg.setupPromptText}
                onConfirm={onConfirmSetup}
              />
            )}

            <div className="mt-3 flex items-center justify-between border-t border-slate-800/60 pt-2 text-[10px] text-slate-500">
              <span className="flex items-center space-x-1 rtl:space-x-reverse text-emerald-400">
                <CheckCircle2 className="h-3 w-3" />
                <span>{msg.source || 'MCP Execution Bus'}</span>
              </span>
              <span>{msg.timestamp}</span>
            </div>
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex items-center space-x-2 text-amber-400 text-xs italic bg-amber-500/5 p-3 rounded-xl border border-amber-500/20 animate-pulse">
          <Bot className="h-4 w-4 animate-spin" />
          <span>Generating cinematic screenplay directives via MCP Engine...</span>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

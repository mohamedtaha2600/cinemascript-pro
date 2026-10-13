import React, { useState } from 'react';
import { Film, Tv, CheckCircle2, Sparkles, Layers } from 'lucide-react';
import { useTranslation } from '@/src/hooks/useTranslation';
import { Button } from '@/src/components/atoms';

export interface ProjectSetupData {
  title: string;
  format: 'Feature Film' | 'Television Series';
  acts: number;
  targetPages: number;
  autoChars: boolean;
  userPromptText: string;
}

export interface AiProjectSetupQuestionCardProps {
  initialPromptText?: string;
  onConfirm: (data: ProjectSetupData) => void;
}

export const AiProjectSetupQuestionCard: React.FC<AiProjectSetupQuestionCardProps> = ({
  initialPromptText = '',
  onConfirm,
}) => {
  const { t, language } = useTranslation();

  const [title, setTitle] = useState(
    initialPromptText ? initialPromptText.slice(0, 30) : (language === 'ar' ? 'مشروع سينمائي جديد' : 'New Cinema Project')
  );
  const [format, setFormat] = useState<'Feature Film' | 'Television Series'>('Television Series');
  const [acts, setActs] = useState<number>(3);
  const [targetPages, setTargetPages] = useState<number>(60);
  const [autoChars, setAutoChars] = useState(true);

  const handleConfirm = () => {
    onConfirm({
      title: title.trim() || (language === 'ar' ? 'سيناريو جديد' : 'Untitled Project'),
      format,
      acts,
      targetPages,
      autoChars,
      userPromptText: initialPromptText,
    });
  };

  return (
    <div className="rounded-2xl bg-[#14161f] border border-amber-500/40 p-4 space-y-4 shadow-xl text-slate-100 font-sans my-2 select-none">
      <div className="flex items-center space-x-2 rtl:space-x-reverse border-b border-slate-800 pb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <h4 className="font-bold text-xs text-amber-400">
            {language === 'ar' ? 'بطاقة إعداد المشروع التفاعلية' : 'Interactive Project Setup Card'}
          </h4>
          <p className="text-[10px] text-slate-400">
            {language === 'ar' ? 'لا يوجد مشروع مفتوح حالياً. حدد تفاصيل مشروعك لإنشائه وبدء المشهد:' : 'No active project found. Configure details below to initialize:'}
          </p>
        </div>
      </div>

      <div className="space-y-3 text-xs">
        <div>
          <label className="block text-[11px] font-mono text-slate-400 mb-1">
            {language === 'ar' ? 'عنوان العمل / المشروع:' : 'Working Project Title:'}
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={language === 'ar' ? 'أدخل عنوان المشروع...' : 'Enter project title...'}
            className="w-full rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-slate-100 border border-slate-800 outline-none focus:border-amber-500/50"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-slate-400 mb-1.5">
            {language === 'ar' ? 'نوع البناء الدرامي:' : 'Narrative Format:'}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div
              onClick={() => { setFormat('Feature Film'); setTargetPages(110); }}
              className={`flex items-center space-x-2 rtl:space-x-reverse rounded-lg p-2.5 cursor-pointer border transition-all ${
                format === 'Feature Film' ? 'bg-amber-500/10 border-amber-500 text-amber-400' : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <Film className="h-4 w-4 shrink-0" />
              <div>
                <div className="font-bold text-[11px]">{language === 'ar' ? 'فيلم روائي طويل' : 'Feature Film'}</div>
                <div className="text-[9px] opacity-70">110 {language === 'ar' ? 'صفحة' : 'Pages'}</div>
              </div>
            </div>

            <div
              onClick={() => { setFormat('Television Series'); setTargetPages(60); }}
              className={`flex items-center space-x-2 rtl:space-x-reverse rounded-lg p-2.5 cursor-pointer border transition-all ${
                format === 'Television Series' ? 'bg-blue-500/10 border-blue-500 text-blue-400' : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <Tv className="h-4 w-4 shrink-0" />
              <div>
                <div className="font-bold text-[11px]">{language === 'ar' ? 'مسلسل تلفزيوني' : 'TV Pilot / Series'}</div>
                <div className="text-[9px] opacity-70">60 {language === 'ar' ? 'صفحة' : 'Pages'}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Layers className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-[11px] font-mono text-slate-300">
              {language === 'ar' ? 'عدد الفصول:' : 'Act Count:'}
            </span>
          </div>
          <div className="flex space-x-1 rtl:space-x-reverse overflow-x-auto pb-0.5">
            {[1, 2, 3, 4, 5].map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setActs(a)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border transition-colors ${
                  acts === a ? 'bg-amber-500 text-black border-amber-500' : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                {a} {language === 'ar' ? 'فصل' : 'Act'}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800">
          <label className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer">
            <input
              type="checkbox"
              checked={autoChars}
              onChange={(e) => setAutoChars(e.target.checked)}
              className="rounded border-slate-700 text-amber-500 focus:ring-0"
            />
            <span className="text-[11px] text-slate-300">
              {language === 'ar' ? 'توليد ملفات الشخصيات وجدول التفكيك تلقائياً' : 'Auto-generate Character profiles & Breakdown items'}
            </span>
          </label>
        </div>
      </div>

      <div className="pt-2">
        <Button variant="primary" size="sm" onClick={handleConfirm} className="w-full py-2.5 text-xs font-bold">
          <CheckCircle2 className="h-4 w-4" />
          <span>{language === 'ar' ? 'تأكيد وإنشاء المشروع وبدء المشهد' : 'Confirm, Initialize Project & Launch'}</span>
        </Button>
      </div>
    </div>
  );
};

import React from 'react';
import { useTranslation } from '@/src/hooks/useTranslation';

export const Footer: React.FC = () => {
  const { t, language } = useTranslation();

  return (
    <footer className="h-7 w-full shrink-0 flex items-center justify-between border-t border-slate-800/80 bg-[#0a0a0c]/90 px-6 font-mono text-[10px] text-slate-400 backdrop-blur-md select-none z-30 font-sans">
      <span>
        {language === 'ar'
          ? '© 2026 سينما سكريبت برو. مصمم خصيصاً للتميز في كتابة السيناريو.'
          : '© 2026 CinemaScript Pro. Built for Hollywood Screenwriting Excellence.'}
      </span>
      <div className="hidden sm:flex items-center space-x-4 rtl:space-x-reverse">
        <a href="#terms" className="hover:text-amber-400 transition-colors">
          {t('terms')}
        </a>
        <a href="#privacy" className="hover:text-amber-400 transition-colors">
          {t('privacy')}
        </a>
        <a href="#rules" className="hover:text-amber-400 transition-colors">
          {t('standardRules')}
        </a>
      </div>
    </footer>
  );
};

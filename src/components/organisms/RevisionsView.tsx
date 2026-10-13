import React from 'react';
import { useProject } from '../../context/ProjectContext';
import { Icon } from '../atoms/Icon';
import { useTranslation } from '../../hooks/useTranslation';

export const RevisionsView: React.FC = () => {
  const { currentProject } = useProject();
  const { t, isRtl, language } = useTranslation();

  const revisionTiers = [
    { 
      draft: language === 'ar' ? 'مسودة الإنتاج البيضاء الأساسية' : 'Production White Draft', 
      date: 'Oct 12, 2024', 
      color: '#ffffff', 
      pages: '1-112', 
      status: language === 'ar' ? 'مغلق' : 'LOCKED', 
      author: language === 'ar' ? 'الكاتب / المخرج' : 'Writer / Director' 
    },
    { 
      draft: language === 'ar' ? 'المراجعة الأولى (الصفحات الزرقاء)' : 'First Revision (Blue Pages)', 
      date: 'Oct 18, 2024', 
      color: '#3b82f6', 
      pages: '4, 12-15, 42, 88', 
      status: language === 'ar' ? 'نشط' : 'ACTIVE', 
      author: language === 'ar' ? 'مشرف السيناريو' : 'Script Supervisor' 
    },
    { 
      draft: language === 'ar' ? 'المراجعة الثانية (الصفحات الوردية)' : 'Second Revision (Pink Pages)', 
      date: 'Oct 25, 2024', 
      color: '#ec4899', 
      pages: '12, 42, 60-63', 
      status: language === 'ar' ? 'قيد المراجعة' : 'PENDING', 
      author: language === 'ar' ? 'المخرج' : 'Director' 
    },
    { 
      draft: language === 'ar' ? 'المراجعة الثالثة (الصفحات الصفراء)' : 'Third Revision (Yellow Pages)', 
      date: 'Nov 02, 2024', 
      color: '#eab308', 
      pages: language === 'ar' ? 'بانتظار الموافقة' : 'Pending review', 
      status: language === 'ar' ? 'في الانتظار' : 'QUEUED', 
      author: language === 'ar' ? 'الإنتاج' : 'Production' 
    }
  ];

  return (
    <main className="flex-1 bg-[#121414] p-6 md:p-10 flex flex-col overflow-y-auto pb-16">
      <div className="flex justify-between items-center border-b border-[#333535] pb-4 mb-6">
        <div>
          <h1 className="font-sans text-2xl font-bold text-white uppercase tracking-wider">
            {t('revisions')}
          </h1>
          <p className="font-mono text-xs text-[#e5beb2] mt-1">
            {language === 'ar' 
              ? `مسودات الإنتاج المعيارية لهوليوود المرمزة بالألوان لـ ${currentProject.title}`
              : `Hollywood standard color-coded production drafts for ${currentProject.title}`}
          </p>
        </div>
        <button className="bg-[#ff5708] text-black font-mono text-xs font-bold px-4 py-2 uppercase tracking-wider hover:bg-[#ffb59c] transition-colors flex items-center gap-1.5 cursor-pointer">
          <Icon name="history_edu" size={16} />
          <span>{language === 'ar' ? 'مستوى مراجعة جديد' : 'New Revision Tier'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {revisionTiers.map((rev, idx) => (
          <div
            key={idx}
            className="bg-[#1a1c1c] border border-[#333535] p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-[#ff5708] transition-colors relative overflow-hidden"
          >
            <div className={`absolute ${isRtl ? 'right-0' : 'left-0'} top-0 bottom-0 w-2`} style={{ backgroundColor: rev.color }}></div>

            <div className={isRtl ? 'pr-3' : 'pl-3'}>
              <div className="flex items-center gap-3">
                <h3 className="font-sans font-bold text-white text-base">{rev.draft}</h3>
                <span className={`font-mono text-[10px] px-2 py-0.5 border ${
                  rev.status === 'ACTIVE' || rev.status === 'نشط'
                    ? 'border-[#ff5708] text-[#ff5708] bg-[#ff5708]/10'
                    : 'border-[#333535] text-[#e5beb2] bg-[#0c0f0f]'
                }`}>
                  {rev.status}
                </span>
              </div>
              <p className="font-mono text-xs text-[#e5beb2] mt-1">
                {language === 'ar' ? `صدر في: ${rev.date} • بواسطة ${rev.author}` : `Issued: ${rev.date} • By ${rev.author}`}
              </p>
            </div>

            <div className="flex items-center gap-6 font-mono text-xs text-[#e5beb2]">
              <div>
                <span className="text-[10px] uppercase text-[#ffb59c] block">{t('affectedPages')}</span>
                <span className="text-white font-bold">{rev.pages}</span>
              </div>

              <div className="flex gap-2">
                <button className="p-2 border border-[#333535] hover:border-white text-white transition-colors cursor-pointer">
                  <Icon name="visibility" size={16} />
                </button>
                <button className="p-2 border border-[#333535] hover:border-white text-white transition-colors cursor-pointer">
                  <Icon name="download" size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

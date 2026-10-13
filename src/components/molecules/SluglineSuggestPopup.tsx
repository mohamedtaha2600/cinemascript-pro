import React, { useEffect } from 'react';
import { useTranslation } from '../../hooks/useTranslation';

interface SluglineSuggestPopupProps {
  query: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}

export const SluglineSuggestPopup: React.FC<SluglineSuggestPopupProps> = ({
  query,
  onSelect,
  onClose
}) => {
  const { language, isRtl } = useTranslation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const standardSluglines = language === 'ar' ? [
    'داخلي. شقة البطل - ليلاً',
    'خارجي. شوارع المدينة - نهاراً',
    'داخلي. غرفة التحقيق - ليلاً',
    'خارجي. الطريق الصحراوي السريع - نهاراً',
    'داخلي/خارجي. سيارة البطل - متواصل',
    'داخلي. المقهى القديم - نهاراً',
    'خارجي. سطح المبنى المهجور - ليلاً'
  ] : [
    'INT. APARTMENT - NIGHT',
    'EXT. CITY STREETS - DAY',
    'INT. INTERROGATION ROOM - NIGHT',
    'EXT. DESERT HIGHWAY - DAY',
    'INT/EXT. CAR - CONTINUOUS',
    'INT. DINER - DAY',
    'EXT. OBSIDIAN TOWER ROOF - NIGHT'
  ];

  const timesOfDay = language === 'ar' ? [
    ' - نهاراً',
    ' - ليلاً',
    ' - متواصل',
    ' - لاحقاً',
    ' - الفجر',
    ' - الغروب'
  ] : [
    ' - DAY',
    ' - NIGHT',
    ' - CONTINUOUS',
    ' - LATER',
    ' - DAWN',
    ' - DUSK'
  ];

  const filtered = standardSluglines.filter(s =>
    s.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className={`absolute ${isRtl ? 'right-0' : 'left-0'} -top-32 z-50 bg-[#09090b] border-2 border-[#ff5708] w-72 shadow-2xl p-2 font-mono text-xs`}>
      <div className="flex justify-between items-center pb-1 mb-1 border-b border-[#333535] text-[#ff5708] text-[10px] uppercase font-bold">
        <span>{language === 'ar' ? 'اقتراحات ترويسة المشهد' : 'Slugline Suggestions'}</span>
        <button onClick={onClose} className="text-[#e5beb2] hover:text-white cursor-pointer">✕</button>
      </div>

      <div className="space-y-1 max-h-36 overflow-y-auto">
        {filtered.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(item)}
            className="w-full text-left p-1.5 hover:bg-[#ff5708] hover:text-black text-white text-[11px] font-bold block truncate transition-colors cursor-pointer"
          >
            {item}
          </button>
        ))}

        <div className="pt-1 border-t border-[#333535] flex flex-wrap gap-1">
          {timesOfDay.map((tod, i) => (
            <button
              key={i}
              onClick={() => onSelect(query + tod)}
              className="bg-[#1a1c1c] hover:bg-[#ff5708] hover:text-black text-[#e5beb2] px-1.5 py-0.5 border border-[#333535] text-[10px] cursor-pointer"
            >
              {tod}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

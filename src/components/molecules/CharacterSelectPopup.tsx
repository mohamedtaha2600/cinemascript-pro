import React, { useEffect } from 'react';
import { Icon } from '../atoms/Icon';
import { useTranslation } from '../../hooks/useTranslation';

export interface SelectOption {
  name: string;
  role: 'LEAD' | 'SUPP' | 'MINOR';
}

export interface CharacterSelectPopupProps {
  options?: SelectOption[];
  characters?: { name: string; role?: string }[];
  onSelect: (name: string) => void;
  onClose: () => void;
}

export const CharacterSelectPopup: React.FC<CharacterSelectPopupProps> = ({
  options,
  characters,
  onSelect,
  onClose
}) => {
  const items = options || (characters || []).map(c => ({ name: c.name, role: 'LEAD' as const }));
  const { isRtl, language } = useTranslation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className={`absolute ${isRtl ? 'right-28' : 'left-28'} top-6 z-50 bg-[#09090b] border-2 border-white w-64 shadow-2xl`}>
      <div className="bg-[#333535] px-3 py-2 font-mono text-xs text-[#e2e2e2] border-b border-[#333535] flex items-center justify-between">
        <span className="font-bold">@ {language === 'ar' ? 'اختيار الشخصية' : 'Character Select'}</span>
        <button onClick={onClose} className="hover:text-white cursor-pointer">
          <Icon name="close" size={16} />
        </button>
      </div>

      <ul className="py-1 font-mono text-xs">
        {items.map((opt, idx) => (
          <li
            key={idx}
            onClick={() => onSelect(opt.name)}
            className={`px-4 py-2 cursor-pointer flex justify-between items-center transition-colors ${
              opt.name === 'MARA'
                ? 'bg-[#ff5708] text-[#000000] font-bold'
                : 'hover:bg-[#1e2020] text-[#e2e2e2]'
            }`}
          >
            <span>{opt.name}</span>
            <span
              className={`text-[10px] uppercase font-bold ${
                opt.name === 'MARA' ? 'text-[#000000]' : 'text-[#e5beb2]'
              }`}
            >
              {opt.role}
            </span>
          </li>
        ))}
      </ul>

      <div className="px-3 py-1.5 border-t border-[#333535] text-[10px] text-[#e5beb2] font-mono">
        {language === 'ar' ? 'ابدأ بالكتابة للتصفية...' : 'Start typing to filter...'}
      </div>
    </div>
  );
};

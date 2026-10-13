import React from 'react';
import { FileText, FileCode, Printer, FileType } from 'lucide-react';

export type ExportFormatType = 'pdf' | 'fdx' | 'fountain' | 'txt';

export interface ExportFormatSelectorProps {
  format: ExportFormatType;
  onFormatChange: (fmt: ExportFormatType) => void;
}

export const ExportFormatSelector: React.FC<ExportFormatSelectorProps> = ({ format, onFormatChange }) => {
  const formats = [
    { id: 'pdf', title: 'PDF Document', desc: 'Standard Hollywood Printable', icon: Printer },
    { id: 'fdx', title: 'Final Draft (.fdx)', desc: 'Industry Standard XML', icon: FileText },
    { id: 'fountain', title: 'Fountain (.fountain)', desc: 'Plain Text Syntax', icon: FileCode },
    { id: 'txt', title: 'Plain Text (.txt)', desc: 'Clean ASCII Output', icon: FileType },
  ] as const;

  return (
    <div className="grid grid-cols-2 gap-3">
      {formats.map((item) => {
        const IconComponent = item.icon;
        const isSelected = format === item.id;
        return (
          <div
            key={item.id}
            onClick={() => onFormatChange(item.id)}
            className={`flex items-center space-x-3 rounded-lg p-3 cursor-pointer border transition-all ${
              isSelected ? 'bg-amber-500/10 border-amber-500 text-slate-100' : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <IconComponent className="h-5 w-5 text-amber-400 shrink-0" />
            <div>
              <h4 className="font-bold text-sm">{item.title}</h4>
              <p className="text-[10px] text-slate-500">{item.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

import React, { useState, useEffect, useCallback } from 'react';
import { useProject } from '@/src/context/ProjectContext';
import { useTranslation } from '@/src/hooks/useTranslation';
import { X, Download } from 'lucide-react';
import { Button } from '@/src/components/atoms';
import { exportToFountain, exportToFDX, downloadFile } from '@/src/utils/screenplay/exporters';
import { ExportFormatSelector, ExportFormatType } from './export/ExportFormatSelector';
import { ExportPreviewPanel } from './export/ExportPreviewPanel';

export const ExportModal: React.FC = () => {
  const { currentProject, isExportOpen, setIsExportOpen } = useProject();
  const { t, language } = useTranslation();
  const [format, setFormat] = useState<ExportFormatType>('pdf');
  const [includeTitlePage, setIncludeTitlePage] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const handleClose = useCallback(() => {
    setIsExportOpen(false);
  }, [setIsExportOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExportOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExportOpen, handleClose]);

  if (!isExportOpen) return null;

  const handleExportNow = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setIsExportOpen(false);

      const filenameSafe = currentProject.title.replace(/\s+/g, '_');

      if (format === 'fountain') {
        const content = exportToFountain(currentProject.title, currentProject.author, currentProject.scriptBlocks);
        downloadFile(content, `${filenameSafe}.fountain`, 'text/plain;charset=utf-8');
      } else if (format === 'fdx') {
        const content = exportToFDX(currentProject.title, currentProject.author, currentProject.scriptBlocks);
        downloadFile(content, `${filenameSafe}.fdx`, 'application/xml;charset=utf-8');
      } else if (format === 'txt') {
        const content = `${currentProject.title.toUpperCase()}\n${currentProject.subtitle}\nBy ${currentProject.author}\n\n==================================\n\n` +
          currentProject.scriptBlocks.map((b) => b.text).join('\n\n');
        downloadFile(content, `${filenameSafe}.txt`, 'text/plain;charset=utf-8');
      } else {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
              <title>${currentProject.title}</title>
              <style>
                @page { size: letter; margin: 1in; }
                body { font-family: monospace; font-size: 12pt; line-height: 1.2; padding: 20px; }
                .title { font-size: 20pt; font-weight: bold; text-align: center; margin-bottom: 20px; }
                .scene-heading { font-weight: bold; text-transform: uppercase; margin-top: 20pt; }
              </style>
            </head>
            <body>
              <div class="title">${currentProject.title.toUpperCase()}</div>
              ${currentProject.scriptBlocks.map((b) => `<div class="${b.type}">${b.text}</div>`).join('')}
              <script>window.print();</script>
            </body>
            </html>
          `;
          printWindow.document.write(htmlContent);
          printWindow.document.close();
        }
      }
    }, 400);
  };

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 select-none font-sans"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl rounded-2xl bg-[#0f1015] p-6 border border-amber-500/30 shadow-2xl space-y-6"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Download className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-lg">{t('exportEngine')}</h3>
              <p className="text-xs text-slate-400 font-mono">
                {language === 'ar' ? 'اختيار صيغة المخرجات وقواعد الطباعة' : 'Select output format & Hollywood print options'}
              </p>
            </div>
          </div>
          <button onClick={handleClose} className="text-slate-400 hover:text-white p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <ExportFormatSelector format={format} onFormatChange={setFormat} />

        <div className="space-y-2">
          <label className="flex items-center space-x-2 rtl:space-x-reverse text-xs text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeTitlePage}
              onChange={(e) => setIncludeTitlePage(e.target.checked)}
              className="rounded border-slate-700 text-amber-500 focus:ring-0"
            />
            <span>{t('includeTitlePage')}</span>
          </label>
        </div>

        <ExportPreviewPanel project={currentProject} includeTitlePage={includeTitlePage} />

        <div className="flex items-center justify-end space-x-3 rtl:space-x-reverse border-t border-slate-800 pt-4">
          <Button variant="outline" onClick={handleClose}>
            {t('cancel')}
          </Button>
          <Button variant="primary" onClick={handleExportNow} disabled={isExporting}>
            {isExporting ? t('generating') : t('exportNow')}
          </Button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useProject } from '@/src/context/ProjectContext';
import { useTranslation } from '@/src/hooks/useTranslation';
import { Table, Filter, Sun, Moon, Download, Users, Shirt, ShieldAlert } from 'lucide-react';
import { Button, Badge } from '@/src/components/atoms';

export const BreakdownReportView: React.FC = () => {
  const { currentProject, searchQuery } = useProject();
  const { t, language } = useTranslation();
  const [activeRowIndex, setActiveRowIndex] = useState<number>(0);
  const [filterIntExt, setFilterIntExt] = useState<'ALL' | 'INT' | 'EXT'>('ALL');

  const filteredRows = currentProject.breakdown.filter((row) => {
    const matchesSearch =
      searchQuery === '' ||
      row.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.characters.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSetting = filterIntExt === 'ALL' || row.setting === filterIntExt;
    return matchesSearch && matchesSetting;
  });

  return (
    <main className="flex-1 bg-[#0a0a0c] flex flex-col overflow-hidden pb-8 select-none">
      <div className="border-b border-slate-800/80 p-4 flex justify-between items-center bg-[#0f1015]/90 backdrop-blur-xl shrink-0">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Table className="h-4 w-4" />
          </div>
          <div>
            <h1 className="font-bold text-slate-100 text-base tracking-tight uppercase">{t('breakdownReport')}</h1>
          </div>
          <Badge variant="primary">{currentProject.scenesCount} Scenes</Badge>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <button
            onClick={() => setFilterIntExt((prev) => (prev === 'ALL' ? 'INT' : prev === 'INT' ? 'EXT' : 'ALL'))}
            className="flex items-center space-x-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-slate-300 hover:border-amber-500/40 hover:text-amber-400 transition-all cursor-pointer"
          >
            <Filter className="h-3.5 w-3.5 text-amber-400" />
            <span>Filter: {filterIntExt}</span>
          </button>
          <Button variant="outline" size="sm">
            <Download className="h-3.5 w-3.5" />
            <span>Export Report</span>
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-6">
        {filteredRows.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-12 text-center text-slate-400">
            <Table className="h-12 w-12 mb-3 text-slate-700" />
            <h3 className="text-base font-bold text-slate-200 mb-1">
              {language === 'ar' ? 'جدول تفريغ الإنتاج فارغ حالياً' : 'No breakdown scenes yet'}
            </h3>
            <p className="font-mono text-xs max-w-sm">
              {language === 'ar'
                ? 'أضف مشاهد السيناريو لتفريغ عناصر الديكور، الإكسسوار، الأزياء، والممثلين تلقائياً.'
                : 'Add screenplay scenes to automatically track props, wardrobe, locations, and cast.'}
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-800/80 bg-[#0f1015]/80 overflow-hidden shadow-2xl backdrop-blur-xl">
            <table className="w-full text-left border-collapse min-w-[850px]">
              <thead className="bg-slate-900/90 font-mono text-xs text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3.5 w-16 text-center">{t('sceneNumber')}</th>
                  <th className="p-3.5 w-24">{t('intExt')}</th>
                  <th className="p-3.5">{t('location')}</th>
                  <th className="p-3.5 w-28">{t('timeOfDay')}</th>
                  <th className="p-3.5 w-1/4">{t('characters')}</th>
                  <th className="p-3.5">{t('props')}</th>
                  <th className="p-3.5">{t('wardrobe')}</th>
                </tr>
              </thead>
              <tbody className="text-xs font-mono text-slate-200 divide-y divide-slate-800/60">
                {filteredRows.map((row, idx) => {
                  const isActive = idx === activeRowIndex;
                  return (
                    <tr
                      key={row.id}
                      onClick={() => setActiveRowIndex(idx)}
                      className={`hover:bg-slate-800/40 transition-colors cursor-pointer ${
                        isActive ? 'bg-amber-500/10' : 'bg-transparent'
                      }`}
                    >
                      <td className="p-3.5 text-center font-bold text-amber-400">{row.sceneNumber}</td>
                      <td className="p-3.5">
                        <Badge variant="outline">{row.setting}</Badge>
                      </td>
                      <td className="p-3.5 font-bold text-slate-100">{row.location}</td>
                      <td className="p-3.5">
                        <span className="flex items-center space-x-1">
                          {row.timeOfDay === 'DAY' ? (
                            <Sun className="h-3.5 w-3.5 text-amber-400" />
                          ) : (
                            <Moon className="h-3.5 w-3.5 text-blue-400" />
                          )}
                          <span className="font-bold">{row.timeOfDay}</span>
                        </span>
                      </td>
                      <td className="p-3.5 text-emerald-400 font-bold">{row.characters.join(', ')}</td>
                      <td className="p-3.5 text-slate-400">{row.props.join(', ') || '-'}</td>
                      <td className="p-3.5 text-slate-400">{row.wardrobe.join(', ') || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
};

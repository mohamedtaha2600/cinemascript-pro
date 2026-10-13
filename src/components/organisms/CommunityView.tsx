import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { Icon } from '../atoms/Icon';
import { useTranslation } from '../../hooks/useTranslation';
import { ProjectData } from '../../types';

interface CommunityTemplate {
  id: string;
  title: string;
  genre: string;
  author: string;
  rating: number;
  downloads: number;
  formatType: 'Feature Film' | 'Television Series';
  actStructure: 3 | 5;
  logline: string;
  tags: string[];
  featuredScene: string;
}

export const CommunityView: React.FC = () => {
  const { createNewProject, setActiveView } = useProject();
  const { t, isRtl, language } = useTranslation();

  const [activeCategory, setActiveCategory] = useState<'TEMPLATES' | 'BEAT_SHEETS' | 'PROMPTS'>('TEMPLATES');
  const [selectedTemplate, setSelectedTemplate] = useState<CommunityTemplate | null>(null);

  const templates: CommunityTemplate[] = [
    {
      id: 'hollywood-thriller',
      title: language === 'ar' ? 'نموذج الإثارة والغموض النيودارك' : 'Neon-Noir Thriller Master Template',
      genre: 'Neo-Noir / Psychological Thriller',
      author: 'Studio Screenwriter Pro',
      rating: 4.9,
      downloads: 1420,
      formatType: 'Feature Film',
      actStructure: 3,
      logline: language === 'ar'
        ? 'مهندس معماري يكتشف عيباً هيكلياً مقصوداً في أكبر برج ذكي في المدينة، ليجد نفسه مطارداً من منظومة أمنية متكاملة.'
        : 'An insomniac architect discovers an engineered structural flaw in the city\'s high-tech grid, thrusting him into a deadly corporate conspiracy.',
      tags: ['Suspense', 'High Stakes', '3-Act Structure', 'Atmospheric'],
      featuredScene: language === 'ar'
        ? 'داخلي. غرفة الخوادم - ليل\nإلياس يدخل في الظلام، أنفاسه متسارعة.\n\nإلياس\n(هامساً)\nلقد فات الأوان... النظام بدأ بالفعل.'
        : 'INT. SERVER VAULT - NIGHT\nELIAS creeps through the shadows, breath tight.\n\nELIAS\n(whispering)\nIt\'s already propagating. They designed the failure.'
    },
    {
      id: 'sci-fi-pilot',
      title: language === 'ar' ? 'نموذج بايلوت خيال علمي 5 فصول' : 'Sci-Fi 1-Hour Pilot (5-Act Structure)',
      genre: 'Sci-Fi / Cyberpunk Drama',
      author: 'Writers Guild Guildmaster',
      rating: 4.8,
      downloads: 980,
      formatType: 'Television Series',
      actStructure: 5,
      logline: language === 'ar'
        ? 'في مستعمرة مدارية معزولة، يتعاون محقق متقاعد مع ذكاء اصطناعي منشق لكشف اختفاء أول مستكشف للفضاء السحيق.'
        : 'On an orbital megastructure, a decommissioned investigator teams with a rogue synthetic core to uncover the truth behind a vanished deep-space crew.',
      tags: ['5-Act TV', 'Worldbuilding', 'Pilot Spec', 'Ensemble'],
      featuredScene: language === 'ar'
        ? 'خارجي. رصيف المحطة الفضائية - مستمر\nتنعكس أضواء النيون الباردة على الخوذة الزجاجية.\n\nمارا\nالترددات مشفرة. إذا عبرنا هذا الباب لا رجوع.'
        : 'EXT. DOCKING RING - CONTINUOUS\nNeon flares across the frosted glass.\n\nMARA\nSignal is scrambled. Once we cross the threshold, comms go dead.'
    },
    {
      id: 'arabic-drama',
      title: language === 'ar' ? 'نموذج الدراما النفسية والاجتماعية' : 'Prestige Character Drama Spec',
      genre: 'Psychological / Family Drama',
      author: 'Cairo Cinema Collective',
      rating: 4.95,
      downloads: 2100,
      formatType: 'Feature Film',
      actStructure: 3,
      logline: language === 'ar'
        ? 'صراع عائلي بين جيلين حول بيع أرشيف سينمائي عريق يكشف أسراراً مدفونة منذ نصف قرن.'
        : 'A generational conflict over the sale of a historic celluloid film archive reveals secrets buried for fifty years.',
      tags: ['Deep Dialogue', 'Subtext', 'Award Winner', 'Intense Arc'],
      featuredScene: language === 'ar'
        ? 'داخلي. قاعة العرض القديمة - نهار\nالغبار يتراقص في حزمة الضوء المنبعثة من جهاز العرض القديم.\n\nسامي\nالسينما ليست مجرد أشرطة نبيعها... هذه ذاكرة المدينة.'
        : 'INT. VINTAGE SCREENING ROOM - DAY\nDust particles dance in the warm beam of a 35mm projector.'
    }
  ];

  const beatSheets = [
    {
      name: language === 'ar' ? 'هيكل بليك سنايدر (Save the Cat)' : 'Blake Snyder\'s Save the Cat Beats',
      beats: '15 Story Beats (Opening Image, Catalyst, Debate, Break into Two, Midpoint, Dark Night, Finale)',
      pages: '110 Pages'
    },
    {
      name: language === 'ar' ? 'رحلة البطل الأسطورية (Hero\'s Journey)' : 'The Hero\'s Journey (Campbell / Vogler)',
      beats: '12 Stages (Ordinary World, Call to Adventure, Ordeal, Resurrection, Return with Elixir)',
      pages: '90-120 Pages'
    },
    {
      name: language === 'ar' ? 'بنية المسلسلات التلفزيونية (5-Act TV Teaser + Acts)' : '5-Act Television Structure',
      beats: 'Teaser + Act I + Act II + Act III + Act IV + Act V (Cliffhanger Act Outs)',
      pages: '55-60 Pages'
    }
  ];

  const handleImport = (template: CommunityTemplate) => {
    createNewProject({
      title: template.title,
      subtitle: `${template.genre} • Template Spec`,
      formatType: template.formatType,
      actStructure: template.actStructure,
      targetPages: template.formatType === 'Feature Film' ? 110 : 60
    });
  };

  return (
    <main className="flex-1 overflow-y-auto bg-[#121414] text-[#e2e2e2] p-6 lg:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="bg-[#0c0f0f] border border-[#333535] p-6 sm:p-8 relative overflow-hidden">
          <div className={`absolute -bottom-10 ${isRtl ? '-left-10' : '-right-10'} text-[#1a1c1c] pointer-events-none select-none`}>
            <Icon name="public" size={220} />
          </div>
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#ff5708]/10 text-[#ff5708] border border-[#ff5708]/30 px-2.5 py-1 text-xs font-mono mb-3">
              <Icon name="star" size={14} />
              <span>{language === 'ar' ? 'منصة مجتمع الكُتّاب وصنّاع السينما' : 'Screenwriter Hub & Community Vault'}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-3 font-sans">
              {language === 'ar' ? 'استوديو النماذج والهياكل الدرامية' : 'Screenplay Templates & Beat Sheets'}
            </h1>
            <p className="text-sm text-[#e5beb2] leading-relaxed font-mono">
              {language === 'ar'
                ? 'استكشف نماذج سيناريو احترافية مطابقة لمعايير هوليوود، هياكل الفصول الدرامية، واقتبسها بضغطة زر واحدة إلى استوديو الكتابة الخاص بك.'
                : 'Explore Hollywood-standard script templates, beat architectures, and import them directly into your studio workspace.'}
            </p>
          </div>
        </div>

        {/* Filter Navigation */}
        <div className="flex gap-2 border-b border-[#333535] pb-2 font-mono text-xs">
          <button
            onClick={() => setActiveCategory('TEMPLATES')}
            className={`px-4 py-2 font-bold uppercase transition-colors cursor-pointer ${
              activeCategory === 'TEMPLATES'
                ? 'bg-[#ff5708] text-black'
                : 'bg-[#1a1c1c] text-[#e5beb2] hover:text-white'
            }`}
          >
            {language === 'ar' ? 'نماذج السيناريو الجاهزة (Templates)' : 'Script Templates'}
          </button>
          <button
            onClick={() => setActiveCategory('BEAT_SHEETS')}
            className={`px-4 py-2 font-bold uppercase transition-colors cursor-pointer ${
              activeCategory === 'BEAT_SHEETS'
                ? 'bg-[#ff5708] text-black'
                : 'bg-[#1a1c1c] text-[#e5beb2] hover:text-white'
            }`}
          >
            {language === 'ar' ? 'الهياكل الدرامية (Beat Sheets)' : 'Beat Sheets'}
          </button>
        </div>

        {/* Content Section */}
        {activeCategory === 'TEMPLATES' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className="bg-[#1a1c1c] border border-[#333535] hover:border-[#ff5708] transition-all flex flex-col justify-between p-5 group"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="text-[10px] font-mono bg-[#0c0f0f] text-[#ff5708] border border-[#333535] px-2 py-0.5">
                      {tpl.genre}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] font-mono text-[#ffb59c]">
                      <Icon name="star" size={13} className="text-[#ff5708]" />
                      <span>{tpl.rating}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#ff5708] transition-colors">
                    {tpl.title}
                  </h3>

                  <p className="text-xs text-[#e5beb2] mb-4 leading-relaxed line-clamp-3">
                    {tpl.logline}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {tpl.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono bg-[#0c0f0f] text-[#888] px-1.5 py-0.5 border border-[#27272a]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#27272a] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#888]">
                    {tpl.actStructure} {language === 'ar' ? 'فصول' : 'Acts'} • {tpl.formatType}
                  </span>
                  <button
                    onClick={() => handleImport(tpl)}
                    className="bg-[#ff5708] hover:bg-[#ffb59c] text-black font-mono font-bold text-xs px-3 py-1.5 uppercase transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Icon name="add" size={14} />
                    <span>{language === 'ar' ? 'استيراد للاستوديو' : 'Import Spec'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeCategory === 'BEAT_SHEETS' && (
          <div className="space-y-4">
            {beatSheets.map((sheet, idx) => (
              <div
                key={idx}
                className="bg-[#1a1c1c] border border-[#333535] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <h3 className="text-base font-bold text-white mb-1">{sheet.name}</h3>
                  <p className="text-xs font-mono text-[#e5beb2]">{sheet.beats}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-xs text-[#ff5708] border border-[#ff5708]/40 px-2 py-1 bg-[#ff5708]/10">
                    {sheet.pages}
                  </span>
                  <button
                    onClick={() => {
                      createNewProject({
                        title: sheet.name,
                        subtitle: 'Beat Sheet Architecture',
                        actStructure: sheet.name.includes('5-Act') ? 5 : 3
                      });
                    }}
                    className="bg-[#ff5708] hover:bg-[#ffb59c] text-black font-mono font-bold text-xs px-3 py-1.5 uppercase transition-colors cursor-pointer"
                  >
                    {language === 'ar' ? 'تطبيق الهيكل' : 'Use Structure'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

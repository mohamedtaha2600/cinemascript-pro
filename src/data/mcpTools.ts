import { MCPToolDefinition } from '../types';

export const CINEMASCRIPT_MCP_TOOLS: MCPToolDefinition[] = [
  // 1. INSPECT & AUDIT TOOLS
  {
    id: 'get_project_summary',
    name: 'get_project_summary',
    category: 'inspect',
    descriptionAr: 'جلب ملخص شامل للمشروع (العنوان، عدد المشاهد، الفصول، الشخصيات، الصفحات، والمدة التقديرية)',
    descriptionEn: 'Retrieve comprehensive project summary (title, scene count, acts, characters, pages, run time)',
    parametersSchema: {},
    enabled: true
  },
  {
    id: 'get_full_screenplay',
    name: 'get_full_screenplay',
    category: 'inspect',
    descriptionAr: 'قراءة نص السيناريو الكامل بجميع صفحاته وكتله النصية وحواراته',
    descriptionEn: 'Fetch the complete screenplay text including all pages, dialogue and scenes',
    parametersSchema: {
      includeBreakdown: { type: 'boolean', description: 'Whether to include breakdown metadata' }
    },
    enabled: true
  },
  {
    id: 'get_scene_by_number',
    name: 'get_scene_by_number',
    category: 'inspect',
    descriptionAr: 'استرجاع تفاصيل مشهد محدد ومحتواه وحواره بناءً على رقم المشهد',
    descriptionEn: 'Fetch contents and dialogue of a specific scene by scene number',
    parametersSchema: {
      scene_number: { type: 'number', required: true, description: 'Scene number (e.g. 1, 2, 3)' }
    },
    enabled: true
  },
  {
    id: 'count_scenes_and_pages',
    name: 'count_scenes_and_pages',
    category: 'inspect',
    descriptionAr: 'إحصاء فوري ودقيق لعدد المشاهد والصفحات والكلمات والزمن التقديري بالدقائق',
    descriptionEn: 'Get exact counts of scenes, pages, words and estimated run-time in minutes',
    parametersSchema: {},
    enabled: true
  },
  {
    id: 'audit_story_structure',
    name: 'audit_story_structure',
    category: 'inspect',
    descriptionAr: 'فحص بنية القصة الدرامية ونقاط التحول (Plot Points) وتوازن الفصول الثلاثة',
    descriptionEn: 'Audit narrative structure, 3-act balance, pacing and dramatic turning points',
    parametersSchema: {
      targetRuntimeMinutes: { type: 'number', description: 'Target runtime in minutes (e.g. 60, 90, 120)' }
    },
    enabled: true
  },
  {
    id: 'detect_missing_scenes_or_plot_holes',
    name: 'detect_missing_scenes_or_plot_holes',
    category: 'inspect',
    descriptionAr: 'فحص فجوات السرد وثغرات الحبكة واقتراح المشاهد المكملة لإكمال القصة',
    descriptionEn: 'Detect narrative gaps, plot holes and identify missing connective scenes',
    parametersSchema: {},
    enabled: true
  },
  {
    id: 'get_character_dossier',
    name: 'get_character_dossier',
    category: 'inspect',
    descriptionAr: 'استرجاع الملف الشامل لشخصية معينة وإحصائيات ظهورها وتطور قوسها الدرامي',
    descriptionEn: 'Retrieve full character dossier, traits, arc, and scene appearance statistics',
    parametersSchema: {
      character_name: { type: 'string', required: true, description: 'Name of character to query' }
    },
    enabled: true
  },

  // 2. WRITE & EDIT TOOLS
  {
    id: 'insert_script_block',
    name: 'insert_script_block',
    category: 'write',
    descriptionAr: 'إدراج كتلة نص سينمائي (ترويسة مشهد، حركة، شخصية، حوار، توجيه أداء، انتقال)',
    descriptionEn: 'Insert a single screenplay block (heading, action, character, dialogue, parenthetical, transition)',
    parametersSchema: {
      type: { type: 'string', enum: ['SCENE_HEADING', 'ACTION', 'CHARACTER', 'DIALOGUE', 'PARENTHETICAL', 'TRANSITION', 'SHOT'], required: true },
      character: { type: 'string', description: 'Character name (if type is dialogue or character)' },
      text: { type: 'string', required: true, description: 'Content text of the block' }
    },
    enabled: true
  },
  {
    id: 'batch_insert_script_blocks',
    name: 'batch_insert_script_blocks',
    category: 'write',
    descriptionAr: 'إدراج مشهد كامل مع حواراته وتوجيهاته دفعة واحدة في السيناريو',
    descriptionEn: 'Batch insert multiple script blocks for a full scene or sequence',
    parametersSchema: {
      blocks: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            type: { type: 'string', enum: ['SCENE_HEADING', 'ACTION', 'CHARACTER', 'DIALOGUE', 'PARENTHETICAL', 'TRANSITION'] },
            character: { type: 'string' },
            text: { type: 'string' }
          }
        },
        required: true
      }
    },
    enabled: true
  },
  {
    id: 'rewrite_scene_block',
    name: 'rewrite_scene_block',
    category: 'write',
    descriptionAr: 'إعادة صياغة أو تعديل كتلة نص أو مشهد محدد لرفع جودة الحوار والأكشن',
    descriptionEn: 'Rewrite or modify a specific block or scene to elevate dialogue & punchiness',
    parametersSchema: {
      block_id: { type: 'string' },
      scene_number: { type: 'number' },
      new_text: { type: 'string', required: true }
    },
    enabled: true
  },
  {
    id: 'delete_page',
    name: 'delete_page',
    category: 'write',
    descriptionAr: 'حذف صفحة بالكامل بناءً على رقم الصفحة في السيناريو وتحديث تسلسل الصفحات',
    descriptionEn: 'Delete an entire screenplay page by page number and recalculate page layout',
    parametersSchema: {
      page_number: { type: 'number', required: true, description: 'Page number to delete (1-indexed)' }
    },
    enabled: true
  },
  {
    id: 'delete_scene',
    name: 'delete_scene',
    category: 'write',
    descriptionAr: 'حذف مشهد بالكامل بجميع نصوصه وحواراته بناءً على رقمه',
    descriptionEn: 'Delete an entire scene including heading, action, and dialogue by scene number',
    parametersSchema: {
      scene_number: { type: 'number', required: true, description: 'Scene number to remove' }
    },
    enabled: true
  },
  {
    id: 'move_scene',
    name: 'move_scene',
    category: 'write',
    descriptionAr: 'تقديم أو تأخير موضع مشهد في تسلسل السيناريو (نقل لأعلى أو لأسفل)',
    descriptionEn: 'Move scene position up or down within the screenplay sequence',
    parametersSchema: {
      scene_number: { type: 'number', required: true },
      direction: { type: 'string', enum: ['up', 'down'], required: true }
    },
    enabled: true
  },

  // 3. PRODUCTION & OUTLINE TOOLS
  {
    id: 'add_scene_card',
    name: 'add_scene_card',
    category: 'production',
    descriptionAr: 'إضافة بطاقة مشهد إلى لوحة الكورك بورد Outliner مع تحديد الفصل والملخص واللون',
    descriptionEn: 'Add scene index card to Corkboard with act number, color tag and logline summary',
    parametersSchema: {
      slugline: { type: 'string', required: true },
      summary: { type: 'string', required: true },
      act: { type: 'number', enum: [1, 2, 3] },
      colorTag: { type: 'string', enum: ['tag-blue', 'tag-pink', 'tag-yellow', 'tag-green'] },
      tagLabel: { type: 'string' }
    },
    enabled: true
  },
  {
    id: 'trigger_corkboard_reorder',
    name: 'trigger_corkboard_reorder',
    category: 'production',
    descriptionAr: 'إعادة ترتيب بطاقات المشاهد في الكورك بورد درامياً لتنسيق تدفق الفصول',
    descriptionEn: 'Reorder scene cards on the corkboard to restructure dramatic pacing',
    parametersSchema: {
      scene_id: { type: 'string', required: true },
      new_position: { type: 'number', required: true }
    },
    enabled: true
  },
  {
    id: 'update_character_bible',
    name: 'update_character_bible',
    category: 'production',
    descriptionAr: 'إضافة أو تحديث شخصية وملفها الدرامي وسماتها النفسية في موسوعة الشخصيات',
    descriptionEn: 'Add or update character dossier, traits, and arc in the Character Bible',
    parametersSchema: {
      character_name: { type: 'string', required: true },
      traits: { type: 'array', items: { type: 'string' } },
      arc: { type: 'string' },
      role: { type: 'string', enum: ['Lead', 'Supporting', 'Minor'] }
    },
    enabled: true
  },
  {
    id: 'add_location',
    name: 'add_location',
    category: 'production',
    descriptionAr: 'توثيق موقع تصوير جديد في قاعدة بيانات مواقع السيناريو (داخلي/خارجي - ليل/نهار)',
    descriptionEn: 'Document a new filming location in the project locations database',
    parametersSchema: {
      name: { type: 'string', required: true },
      type: { type: 'string', enum: ['INT', 'EXT', 'INT/EXT'], required: true },
      description: { type: 'string' },
      timeOfDay: { type: 'string', enum: ['DAY', 'NIGHT', 'CONTINUOUS', 'LATER'] }
    },
    enabled: true
  },
  {
    id: 'add_breakdown_item',
    name: 'add_breakdown_item',
    category: 'production',
    descriptionAr: 'إضافة سطر تفريغ إنتاجي (تحديد الممثلين، الملابس، والإكسسوارات لمشهد)',
    descriptionEn: 'Add production breakdown row with characters, wardrobe, and props',
    parametersSchema: {
      setting: { type: 'string', enum: ['INT', 'EXT', 'INT/EXT'] },
      location: { type: 'string', required: true },
      timeOfDay: { type: 'string', enum: ['DAY', 'NIGHT', 'DUSK', 'DAWN', 'CONTINUOUS'] },
      characters: { type: 'array', items: { type: 'string' } },
      props: { type: 'array', items: { type: 'string' } },
      wardrobe: { type: 'array', items: { type: 'string' } }
    },
    enabled: true
  },
  {
    id: 'update_project_metadata',
    name: 'update_project_metadata',
    category: 'production',
    descriptionAr: 'تعديل بيانات الفيلم (العنوان، اللوجلاين، نوع العمل، وعدد الصفحات المستهدفة)',
    descriptionEn: 'Update project title, subtitle, target pages, and format type',
    parametersSchema: {
      title: { type: 'string' },
      subtitle: { type: 'string' },
      formatType: { type: 'string', enum: ['Feature Film', 'Television Series'] },
      targetPages: { type: 'number' },
      author: { type: 'string' }
    },
    enabled: true
  },
  {
    id: 'navigate_to',
    name: 'navigate_to',
    category: 'production',
    descriptionAr: 'التنقل التلقائي بين واجهات الاستوديو (المحرر، الكورك بورد، التفريغ، الموسوعة)',
    descriptionEn: 'Navigate between studio views (editor, outliner, breakdown, bible, characters, revisions)',
    parametersSchema: {
      view_name: { type: 'string', enum: ['editor', 'outliner', 'breakdown', 'bible', 'characters', 'community', 'revisions', 'projects'], required: true },
      page_number: { type: 'number' }
    },
    enabled: true
  },
  {
    id: 'open_modal',
    name: 'open_modal',
    category: 'production',
    descriptionAr: 'فتح نوافذ التصدير والطباعة (PDF / Final Draft / Fountain) أو نافذة الإعدادات',
    descriptionEn: 'Open export modal (PDF, FDX, Fountain), new scene or settings dialog',
    parametersSchema: {
      modal_type: { type: 'string', enum: ['ExportModal', 'NewProjectModal', 'NewSceneModal', 'SettingsModal'], required: true }
    },
    enabled: true
  },

  // 4. AUTONOMOUS STORY GENERATION LOOP
  {
    id: 'write_story_in_phases',
    name: 'write_story_in_phases',
    category: 'autonomous',
    descriptionAr: 'كتابة قصة كاملة (مثل 60 دقيقة) على مراحل متواصلة؛ يكتب الوكيل المشاهد فصلاً تلو الآخر ذاتياً مع التحقق المستمر',
    descriptionEn: 'Autonomous iterative multi-phase writing loop; writes full screenplay phase by phase until target pages are met',
    parametersSchema: {
      story_premise: { type: 'string', required: true, description: 'Core premise or story theme' },
      target_runtime_minutes: { type: 'number', default: 60, description: 'Target runtime in minutes (e.g. 60, 90)' },
      current_phase: { type: 'number', description: 'Phase step index (1: Act 1 Setup, 2: Act 2 Complications, 3: Act 3 Climax)' },
      continue_next_phase_automatically: { type: 'boolean', default: true }
    },
    enabled: true
  }
];

export const DEFAULT_ENABLED_MCP_TOOL_IDS = CINEMASCRIPT_MCP_TOOLS.map(t => t.id);

export interface ShortcutDefinition {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  descriptionAr: string;
  descriptionEn: string;
}

export const KEYBOARD_SHORTCUTS = {
  SAVE_PROJECT: {
    key: 's',
    ctrlKey: true,
    descriptionAr: 'حفظ المشروع سينمائياً',
    descriptionEn: 'Save Project',
  },
  UNDO: {
    key: 'z',
    ctrlKey: true,
    descriptionAr: 'التراجع عن الخاطرة السابقة',
    descriptionEn: 'Undo',
  },
  REDO: {
    key: 'y',
    ctrlKey: true,
    descriptionAr: 'إعادة التعديل المحذوف',
    descriptionEn: 'Redo',
  },
  NEW_SCENE: {
    key: 'n',
    ctrlKey: true,
    altKey: true,
    descriptionAr: 'إضافة مشهد جديد تلقائي',
    descriptionEn: 'New Scene',
  },
  TOGGLE_AI_ASSISTANT: {
    key: 'k',
    ctrlKey: true,
    descriptionAr: 'فتح مساعد السيرفر الذكي AI',
    descriptionEn: 'Toggle AI Core Agent',
  },
  CLOSE_MODAL: {
    key: 'Escape',
    descriptionAr: 'إغلاق الشاشة المنبثقة',
    descriptionEn: 'Close Modal',
  },
} as const;

import { en } from './locales/en';
import { ar } from './locales/ar';

export type Language = 'en' | 'ar';

export type TranslationKey = keyof typeof en;

export const translations = {
  en,
  ar,
} as const;

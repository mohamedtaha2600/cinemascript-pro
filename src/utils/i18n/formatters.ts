import { Language } from '@/src/i18n/translations';

export function formatNumber(value: number, lang: Language): string {
  if (lang === 'ar') {
    return new Intl.NumberFormat('ar-EG').format(value);
  }
  return new Intl.NumberFormat('en-US').format(value);
}

export function formatPageCount(pages: number, lang: Language): string {
  const formatted = formatNumber(pages, lang);
  if (lang === 'ar') {
    return `${formatted} ${pages === 1 ? 'صفحة' : 'صفحات'}`;
  }
  return `${formatted} ${pages === 1 ? 'Page' : 'Pages'}`;
}

export function formatWordCount(words: number, lang: Language): string {
  const formatted = formatNumber(words, lang);
  if (lang === 'ar') {
    return `${formatted} كلمة`;
  }
  return `${formatted} Words`;
}

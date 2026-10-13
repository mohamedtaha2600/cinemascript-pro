import { useProject } from '../context/ProjectContext';
import { translations, TranslationKey } from '../i18n/translations';

export const useTranslation = () => {
  const { language, isRtl, setLanguage, toggleLanguage, t } = useProject();

  return {
    language,
    isRtl,
    setLanguage,
    toggleLanguage,
    t: (key: TranslationKey) => t(key),
    strings: translations[language]
  };
};

export default useTranslation;

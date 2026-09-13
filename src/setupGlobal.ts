import { getTranslation, SupportedLanguage } from './utils/i18n';

(window as any).__currentLang = 'en';

(window as any).t = (key: string, fallback?: string) => {
  const lang = (window as any).__currentLang as SupportedLanguage;
  return getTranslation(lang, key, fallback);
};

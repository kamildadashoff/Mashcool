import { az } from './az';
import { en } from './en';
import { ru } from './ru';
import { Locale } from '../types';

export const translations = {
  az,
  en,
  ru,
};

export function getTranslation(locale: Locale) {
  return translations[locale] || translations.az;
}

export function detectInitialLocale(): Locale {
  // 1. Saved preference
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('mashcool_locale') as Locale;
    if (saved && ['az', 'en', 'ru'].includes(saved)) {
      return saved;
    }
    // 2. URL path
    const pathname = window.location.pathname;
    if (pathname.startsWith('/en')) return 'en';
    if (pathname.startsWith('/ru')) return 'ru';

    // 3. Browser language
    const navLang = navigator.language.toLowerCase();
    if (navLang.startsWith('ru')) return 'ru';
    if (navLang.startsWith('en')) return 'en';
    if (navLang.startsWith('az')) return 'az';
  }
  // 4. Default fallback: AZ
  return 'az';
}

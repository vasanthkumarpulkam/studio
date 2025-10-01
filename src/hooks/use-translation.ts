
'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/language-context';
import en from '@/locales/en.json';
import es from '@/locales/es.json';

const translations: Record<string, any> = { en, es };

export function useTranslation() {
  const { language } = useLanguage();
  const [t, setT] = useState<{ fn: (key: string) => string, ready: boolean }>({ fn: (key: string) => key, ready: false });

  useEffect(() => {
    const translate = (key: string): string => {
      return translations[language]?.[key] || key;
    };
    setT({ fn: translate, ready: true });
  }, [language]);

  return { t: t.fn, isTranslationReady: t.ready };
}

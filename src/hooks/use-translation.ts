
'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/language-context';
import en from '@/locales/en.json';
import es from '@/locales/es.json';

const translations: Record<string, any> = { en, es };

export function useTranslation() {
  const { language } = useLanguage();
  const [t, setT] = useState<((key: string) => string) | null>(null);

  useEffect(() => {
    const translate = (key: string): string => {
      return translations[language][key] || key;
    };
    setT(() => translate);
  }, [language]);

  return { t };
}

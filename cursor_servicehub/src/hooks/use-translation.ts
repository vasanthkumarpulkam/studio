
'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/language-context';
import en from '@/locales/en.json';
import es from '@/locales/es.json';

const translations: Record<string, any> = { en, es };

export function useTranslation() {
  const { language } = useLanguage();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const t = (key: string, options?: { [key: string]: string | number }): string => {
    if (!isClient) return key; // Return key on server or before mount
    
    let translation = translations[language]?.[key] || key;

    if (options) {
      Object.keys(options).forEach(optionKey => {
        translation = translation.replace(`{${optionKey}}`, String(options[optionKey]));
      });
    }

    return translation;
  };
  
  return { t, isTranslationReady: isClient, language };
}

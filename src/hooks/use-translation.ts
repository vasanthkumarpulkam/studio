
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

  const t = (key: string): string => {
    // On the server or before the client has mounted, return the key to avoid mismatches
    if (!isClient) return key;
    return translations[language]?.[key] || key;
  };
  
  // isTranslationReady is true only on the client
  return { t, isTranslationReady: isClient };
}

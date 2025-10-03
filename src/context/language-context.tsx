
'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useUser } from '@/firebase';
import { db } from '@/firebase/config';
import { doc, updateDoc } from 'firebase/firestore';

type LanguageContextType = {
  language: string;
  setLanguage: (language: string) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState('en');
  const { user } = useUser();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    if (user?.language && user.language !== language) {
      setLanguage(user.language);
    }
  }, [user?.language]);

  const value = {
    language,
    setLanguage: async (lang: string) => {
      setLanguage(lang);
      localStorage.setItem('language', lang);
      if (user?.uid) {
        try { await updateDoc(doc(db, 'users', user.uid), { language: lang }); } catch {}
      }
    },
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

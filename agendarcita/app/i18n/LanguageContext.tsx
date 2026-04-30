'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import t, { Lang } from './translations';

interface LangCtx {
  lang: Lang;
  toggle: () => void;
  T: (typeof t)['es'] | (typeof t)['en'];
}

const LanguageContext = createContext<LangCtx>({
  lang: 'es',
  toggle: () => {},
  T: t.es,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('es');

  useEffect(() => {
    const saved = localStorage.getItem('lang') as Lang | null;
    if (saved === 'en' || saved === 'es') setLang(saved);
  }, []);

  function toggle() {
    const next: Lang = lang === 'es' ? 'en' : 'es';
    setLang(next);
    localStorage.setItem('lang', next);
  }

  return (
    <LanguageContext.Provider value={{ lang, toggle, T: t[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

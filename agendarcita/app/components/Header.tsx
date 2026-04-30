'use client';

import Image from 'next/image';
import { useLanguage } from '../i18n/LanguageContext';

export default function Header() {
  const { lang, toggle, T } = useLanguage();

  return (
    <header style={{ backgroundColor: '#1B4F8A' }} className="py-5 px-4 shadow-lg">
      <div className="max-w-3xl mx-auto flex items-center gap-4">
        <Image src="/nexa-logo.png" alt="NexaEHR" width={44} height={44} className="flex-shrink-0" />
        <div className="flex-1">
          <p className="text-blue-200 text-xs font-medium tracking-wide">{T.header.subtitle}</p>
          <h1 className="text-white text-xl font-bold leading-tight">{T.header.title}</h1>
        </div>
        <button
          type="button"
          onClick={toggle}
          className="flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
          style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)' }}
        >
          {lang === 'es' ? '🇺🇸 EN' : '🇻🇪 ES'}
        </button>
      </div>
    </header>
  );
}

'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import Header from '../components/Header';
import { useLanguage } from '../i18n/LanguageContext';

const DEPT_SLUGS = [
  { slug: 'oftalmologia', icon: '👁️', intake: false },
  { slug: 'traumatologia', icon: '🦴', intake: false },
  { slug: 'oncologia', icon: '🩺', intake: false },
  { slug: 'estetica', icon: '✨', intake: true },
  { slug: 'medicina_general', icon: '⚕️', intake: true },
] as const;

function DeptPicker() {
  const router = useRouter();
  const params = useSearchParams();
  const { T } = useLanguage();

  const query = params.toString();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      <Header />
      <main className="max-w-lg mx-auto px-4 py-10">
        <div className="mb-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm font-medium mb-4 px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
            style={{ backgroundColor: '#ef4444', color: '#ffffff' }}
          >
            {T.back}
          </button>
          <h2 className="text-lg font-semibold text-gray-800 mb-1">{T.depts.title}</h2>
          <p className="text-sm text-gray-400">{T.depts.subtitle}</p>
        </div>

        <div className="space-y-3">
          {DEPT_SLUGS.map((d) => {
            const info = T.depts[d.slug];
            return (
              <button
                key={d.slug}
                type="button"
                onClick={() => router.push(d.intake ? `/agendar/${d.slug}?${query}` : `/agendar/${d.slug}/calendario?${query}`)}
                className="w-full bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all text-left flex items-center gap-4 group"
                style={{ border: '2px solid #e5e7eb' }}
              >
                <span className="text-4xl">{d.icon}</span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">
                    {info.label}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{info.desc}</p>
                </div>
                <span className="text-gray-300 group-hover:text-blue-400 transition-colors text-lg">→</span>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default function AgendarPage() {
  return (
    <Suspense>
      <DeptPicker />
    </Suspense>
  );
}

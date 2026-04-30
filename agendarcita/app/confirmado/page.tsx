'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Header from '../components/Header';
import { useLanguage } from '../i18n/LanguageContext';

const DEPT_ICONS: Record<string, string> = {
  oftalmologia: '👁️',
  traumatologia: '🦴',
  oncologia: '🩺',
  estetica: '✨',
  medicina_general: '⚕️',
};

function ConfirmadoContent() {
  const params = useSearchParams();
  const { T } = useLanguage();
  const c = T.confirmado;

  const dept = params.get('dept') ?? '';
  const nombre = params.get('nombre') ?? 'Paciente';
  const slot = params.get('slot') ?? '';

  const deptInfo = T.depts[dept as keyof typeof T.depts] as { label: string } | undefined;
  const deptLabel = deptInfo?.label ?? dept;
  const icon = DEPT_ICONS[dept] ?? '🏥';

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      <Header />

      <main className="max-w-md mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-md p-8 text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ backgroundColor: '#d1fae5' }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#059669">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-1">{c.title}</h2>
          <p className="text-sm text-gray-400 mb-6">{c.subtitle}</p>

          <div
            className="rounded-2xl p-5 text-left space-y-3 mb-6"
            style={{ backgroundColor: '#F8FAFC', border: '1px solid #e5e7eb' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">{c.patient}</span>
              <span className="text-sm font-semibold text-gray-700">{nombre}</span>
            </div>
            <div className="border-t border-gray-100" />
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">{c.department}</span>
              <span className="text-sm font-semibold text-gray-700">{icon} {deptLabel}</span>
            </div>
            <div className="border-t border-gray-100" />
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">{c.schedule}</span>
              <span className="text-sm font-semibold text-gray-700">{slot.replace('-', ' · ')}</span>
            </div>
          </div>

          <p className="text-xs text-gray-400 mb-6 leading-relaxed">{c.note}</p>

          <Link
            href="/"
            className="inline-block text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#1B4F8A' }}
          >
            {c.another}
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function ConfirmadoPage() {
  return (
    <Suspense>
      <ConfirmadoContent />
    </Suspense>
  );
}

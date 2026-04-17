'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import Header from '../components/Header';

const DEPARTMENTS = [
  { slug: 'oftalmologia', label: 'Oftalmología', icon: '👁️', desc: 'Salud visual y ocular' },
  { slug: 'traumatologia', label: 'Traumatología', icon: '🦴', desc: 'Lesiones músculo-esqueléticas' },
  { slug: 'oncologia', label: 'Oncología', icon: '🩺', desc: 'Diagnóstico y tratamiento oncológico' },
];

function DeptPicker() {
  const router = useRouter();
  const params = useSearchParams();

  const query = params.toString();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      <Header />
      <main className="max-w-lg mx-auto px-4 py-10">
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Selecciona el Departamento</h2>
          <p className="text-sm text-gray-400">¿A qué especialidad deseas agendar tu cita?</p>
        </div>

        <div className="space-y-3">
          {DEPARTMENTS.map((d) => (
            <button
              key={d.slug}
              type="button"
              onClick={() => router.push(`/agendar/${d.slug}/calendario?${query}`)}
              className="w-full bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all text-left flex items-center gap-4 group"
              style={{ border: '2px solid #e5e7eb' }}
            >
              <span className="text-4xl">{d.icon}</span>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">
                  {d.label}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{d.desc}</p>
              </div>
              <span className="text-gray-300 group-hover:text-blue-400 transition-colors text-lg">→</span>
            </button>
          ))}
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

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from './components/Header';

export default function HomePage() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [cedula, setCedula] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const canSubmit = nombre.trim() && apellido.trim() && cedula.trim() && email.trim();

  async function handleContinuar() {
    if (!canSubmit) return;
    setLoading(true);
    const normalized = cedula.replace(/\D/g, '');
    try {
      await fetch('/api/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, cedula: normalized, email }),
      });
    } catch (_) {
      // continue even if email fails in demo
    }
    router.push(`/verificando?cedula=${normalized}&email=${encodeURIComponent(email)}`);
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      <Header />

      <main className="max-w-md mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-lg font-semibold mb-1" style={{ color: '#1A202C' }}>
            Identificación del Paciente
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            Ingrese sus datos para continuar con el agendamiento
          </p>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                  Nombre
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="José"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                  Apellido
                </label>
                <input
                  type="text"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  placeholder="Contreras"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                Número de Cédula
              </label>
              <input
                type="text"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                placeholder="30.496.453"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@email.com"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:border-transparent transition"
              />
            </div>

            <button
              type="button"
              onClick={handleContinuar}
              disabled={!canSubmit || loading}
              className="w-full text-white font-semibold py-3 rounded-xl mt-2 transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide"
              style={{ backgroundColor: '#1B4F8A' }}
            >
              {loading ? 'Procesando...' : 'Continuar →'}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-5 leading-relaxed">
          Sus datos están protegidos bajo confidencialidad médica y son de uso
          exclusivo del Hospital Domingo Luciani
        </p>
      </main>
    </div>
  );
}

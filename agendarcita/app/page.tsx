'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from './components/Header';

const MESES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1919 }, (_, i) => CURRENT_YEAR - i);

function daysInMonth(month: number, year: number) {
  if (!month || !year) return 31;
  return new Date(year, month, 0).getDate();
}

const selectClass =
  'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:border-transparent transition';

export default function HomePage() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [cedula, setCedula] = useState('');
  const [telefono, setTelefono] = useState('');
  const [dia, setDia] = useState('');
  const [mes, setMes] = useState('');
  const [anio, setAnio] = useState('');
  const [sexo, setSexo] = useState('');

  const nacimiento = dia && mes && anio ? `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}` : '';
  const canSubmit = nombre.trim() && apellido.trim() && cedula.trim() && telefono.trim() && nacimiento && sexo;

  function handleContinuar() {
    if (!canSubmit) return;
    const normalized = cedula.replace(/\D/g, '');
    const params = new URLSearchParams({ cedula: normalized, nombre, apellido, email: telefono, nacimiento, sexo });
    router.push(`/agendar?${params.toString()}`);
  }

  const maxDays = daysInMonth(Number(mes), Number(anio));
  const days = Array.from({ length: maxDays }, (_, i) => i + 1);

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
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Nombre</label>
                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="José"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:border-transparent transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Apellido</label>
                <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} placeholder="Contreras"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:border-transparent transition" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Número de Cédula</label>
              <input type="text" value={cedula} onChange={(e) => setCedula(e.target.value)} placeholder="30.496.453"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:border-transparent transition" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Número de Teléfono</label>
              <div className="flex">
                <div className="flex items-center gap-1.5 px-3 py-2.5 border border-gray-200 border-r-0 rounded-l-lg bg-gray-50 text-sm font-medium text-gray-700 flex-shrink-0">
                  🇻🇪 +58
                </div>
                <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="4121234567"
                  className="flex-1 border border-gray-200 rounded-r-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:border-transparent transition" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Fecha de Nacimiento</label>
              <div className="grid grid-cols-3 gap-2">
                <select value={dia} onChange={(e) => setDia(e.target.value)} className={selectClass}>
                  <option value="">Día</option>
                  {days.map((d) => (
                    <option key={d} value={String(d)}>{d}</option>
                  ))}
                </select>
                <select value={mes} onChange={(e) => setMes(e.target.value)} className={selectClass}>
                  <option value="">Mes</option>
                  {MESES.map((m, i) => (
                    <option key={m} value={String(i + 1)}>{m}</option>
                  ))}
                </select>
                <select value={anio} onChange={(e) => setAnio(e.target.value)} className={selectClass}>
                  <option value="">Año</option>
                  {YEARS.map((y) => (
                    <option key={y} value={String(y)}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Sexo</label>
              <select value={sexo} onChange={(e) => setSexo(e.target.value)} className={selectClass}>
                <option value="">—</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleContinuar}
              disabled={!canSubmit}
              className="w-full text-white font-semibold py-3 rounded-xl mt-2 transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide"
              style={{ backgroundColor: '#1B4F8A' }}
            >
              Continuar →
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-5 leading-relaxed">
          Sus datos están protegidos bajo confidencialidad médica y son de uso
          exclusivo de NexaEHR
        </p>
      </main>
    </div>
  );
}

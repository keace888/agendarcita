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

const inputClass =
  'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:border-transparent transition';

const selectClass =
  'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:border-transparent transition';

function Section({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">{title}</span>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();

  // Core identity
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [cedula, setCedula] = useState('');
  const [telefono, setTelefono] = useState('');
  const [countryCode, setCountryCode] = useState('+58');
  const [sexo, setSexo] = useState('');

  // Nacimiento
  const [dia, setDia] = useState('');
  const [mes, setMes] = useState('');
  const [anio, setAnio] = useState('');
  const [lugarNacimiento, setLugarNacimiento] = useState('');
  const [nacionalidad, setNacionalidad] = useState('');
  const [ocupacion, setOcupacion] = useState('');

  // Estado civil & dirección
  const [estadoCivil, setEstadoCivil] = useState('');
  const [direccion, setDireccion] = useState('');

  // Contacto de emergencia
  const [ceNombre, setCeNombre] = useState('');
  const [ceParentesco, setCeParentesco] = useState('');
  const [ceDireccion, setCeDireccion] = useState('');

  const nacimiento = dia && mes && anio ? `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}` : '';
  const canSubmit = nombre.trim() && apellido.trim() && cedula.trim() && telefono.trim() && nacimiento && sexo;

  function handleTelefono(raw: string) {
    const digits = raw.replace(/\D/g, '').slice(0, 10);
    let formatted = digits;
    if (digits.length > 6) formatted = `(${digits.slice(0, 3)})-${digits.slice(3, 6)}-${digits.slice(6)}`;
    else if (digits.length > 3) formatted = `(${digits.slice(0, 3)})-${digits.slice(3)}`;
    else if (digits.length > 0) formatted = `(${digits}`;
    setTelefono(formatted);
  }

  function handleContinuar() {
    if (!canSubmit) return;
    const normalized = cedula.replace(/\D/g, '');
    const digits = telefono.replace(/\D/g, '');

    // Save extra demographic fields to sessionStorage
    sessionStorage.setItem('patient_extra', JSON.stringify({
      lugar_nacimiento: lugarNacimiento,
      nacionalidad,
      ocupacion,
      estado_civil: estadoCivil,
      direccion,
      contacto_emergencia_nombre: ceNombre,
      contacto_emergencia_parentesco: ceParentesco,
      contacto_emergencia_direccion: ceDireccion,
    }));

    const params = new URLSearchParams({
      cedula: normalized,
      nombre,
      apellido,
      email: `${countryCode}${digits}`,
      nacimiento,
      sexo,
    });
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

            {/* ── Datos personales ── */}
            <Section title="Datos Personales" />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Nombre</label>
                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="José" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Apellido</label>
                <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} placeholder="Contreras" className={inputClass} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Cédula / Pasaporte</label>
              <input type="text" value={cedula} onChange={(e) => setCedula(e.target.value)} placeholder="30.496.453" className={inputClass} />
              <p className="text-xs text-gray-400 mt-1">Cédula si eres venezolano, número de pasaporte si eres extranjero</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Número de Teléfono</label>
              <div className="flex">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="border border-gray-200 border-r-0 rounded-l-lg px-2 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:border-transparent transition flex-shrink-0"
                >
                  <option value="+58">🇻🇪 +58</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+57">🇨🇴 +57</option>
                </select>
                <input type="tel" value={telefono} onChange={(e) => handleTelefono(e.target.value)} placeholder="(412)-123-4567"
                  className="flex-1 border border-gray-200 rounded-r-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:border-transparent transition" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Sexo</label>
                <select value={sexo} onChange={(e) => setSexo(e.target.value)} className={selectClass}>
                  <option value="">—</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Estado Civil</label>
                <select value={estadoCivil} onChange={(e) => setEstadoCivil(e.target.value)} className={selectClass}>
                  <option value="">—</option>
                  <option value="soltero">Soltero/a</option>
                  <option value="casado">Casado/a</option>
                  <option value="divorciado">Divorciado/a</option>
                  <option value="viudo">Viudo/a</option>
                  <option value="union_libre">Unión libre</option>
                </select>
              </div>
            </div>

            {/* ── Nacimiento ── */}
            <Section title="Nacimiento" />

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Fecha de Nacimiento</label>
              <div className="grid grid-cols-3 gap-2">
                <select value={dia} onChange={(e) => setDia(e.target.value)} className={selectClass}>
                  <option value="">Día</option>
                  {days.map((d) => <option key={d} value={String(d)}>{d}</option>)}
                </select>
                <select value={mes} onChange={(e) => setMes(e.target.value)} className={selectClass}>
                  <option value="">Mes</option>
                  {MESES.map((m, i) => <option key={m} value={String(i + 1)}>{m}</option>)}
                </select>
                <select value={anio} onChange={(e) => setAnio(e.target.value)} className={selectClass}>
                  <option value="">Año</option>
                  {YEARS.map((y) => <option key={y} value={String(y)}>{y}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Lugar de Nacimiento</label>
              <input type="text" value={lugarNacimiento} onChange={(e) => setLugarNacimiento(e.target.value)} placeholder="Caracas, Venezuela" className={inputClass} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Nacionalidad</label>
                <input type="text" value={nacionalidad} onChange={(e) => setNacionalidad(e.target.value)} placeholder="Venezolano/a" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Ocupación</label>
                <input type="text" value={ocupacion} onChange={(e) => setOcupacion(e.target.value)} placeholder="Ingeniero" className={inputClass} />
              </div>
            </div>

            {/* ── Dirección ── */}
            <Section title="Dirección" />

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Dirección de Residencia</label>
              <input type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder="Av. Libertador, Edif. Centro, Piso 3, Caracas" className={inputClass} />
            </div>

            {/* ── Contacto de emergencia ── */}
            <Section title="Contacto de Emergencia" />

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Nombre</label>
              <input type="text" value={ceNombre} onChange={(e) => setCeNombre(e.target.value)} placeholder="María Contreras" className={inputClass} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Parentesco</label>
              <input type="text" value={ceParentesco} onChange={(e) => setCeParentesco(e.target.value)} placeholder="Madre" className={inputClass} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Dirección</label>
              <input type="text" value={ceDireccion} onChange={(e) => setCeDireccion(e.target.value)} placeholder="Av. Libertador, Caracas" className={inputClass} />
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

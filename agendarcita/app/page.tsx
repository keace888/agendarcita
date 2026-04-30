'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from './components/Header';
import { useLanguage } from './i18n/LanguageContext';

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
  const { T } = useLanguage();
  const h = T.home;

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [cedula, setCedula] = useState('');
  const [telefono, setTelefono] = useState('');
  const [countryCode, setCountryCode] = useState('+58');
  const [sexo, setSexo] = useState('');
  const [dia, setDia] = useState('');
  const [mes, setMes] = useState('');
  const [anio, setAnio] = useState('');
  const [lugarNacimiento, setLugarNacimiento] = useState('');
  const [nacionalidad, setNacionalidad] = useState('');
  const [ocupacion, setOcupacion] = useState('');
  const [estadoCivil, setEstadoCivil] = useState('');
  const [direccion, setDireccion] = useState('');
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
    const params = new URLSearchParams({ cedula: normalized, nombre, apellido, email: `${countryCode}${digits}`, nacimiento, sexo });
    router.push(`/agendar?${params.toString()}`);
  }

  const maxDays = daysInMonth(Number(mes), Number(anio));
  const days = Array.from({ length: maxDays }, (_, i) => i + 1);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      <Header />
      <main className="max-w-md mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-lg font-semibold mb-1" style={{ color: '#1A202C' }}>{h.title}</h2>
          <p className="text-sm text-gray-400 mb-6">{h.subtitle}</p>

          <div className="space-y-4">
            <Section title={h.sections.personal} />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">{h.fields.nombre}</label>
                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder={h.placeholders.nombre} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">{h.fields.apellido}</label>
                <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} placeholder={h.placeholders.apellido} className={inputClass} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">{h.fields.cedula}</label>
              <input type="text" value={cedula} onChange={(e) => setCedula(e.target.value)} placeholder={h.placeholders.cedula} className={inputClass} />
              <p className="text-xs text-gray-400 mt-1">{h.fields.cedulaHint}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">{h.fields.telefono}</label>
              <div className="flex">
                <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)}
                  className="border border-gray-200 border-r-0 rounded-l-lg px-2 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:border-transparent transition flex-shrink-0">
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
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">{h.fields.sexo}</label>
                <select value={sexo} onChange={(e) => setSexo(e.target.value)} className={selectClass}>
                  <option value="">{h.sexoOptions.placeholder}</option>
                  <option value="M">{h.sexoOptions.M}</option>
                  <option value="F">{h.sexoOptions.F}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">{h.fields.estadoCivil}</label>
                <select value={estadoCivil} onChange={(e) => setEstadoCivil(e.target.value)} className={selectClass}>
                  <option value="">{h.estadoCivilOptions.placeholder}</option>
                  <option value="soltero">{h.estadoCivilOptions.soltero}</option>
                  <option value="casado">{h.estadoCivilOptions.casado}</option>
                  <option value="divorciado">{h.estadoCivilOptions.divorciado}</option>
                  <option value="viudo">{h.estadoCivilOptions.viudo}</option>
                  <option value="union_libre">{h.estadoCivilOptions.union_libre}</option>
                </select>
              </div>
            </div>

            <Section title={h.sections.nacimiento} />

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">{h.fields.fechaNacimiento}</label>
              <div className="grid grid-cols-3 gap-2">
                <select value={dia} onChange={(e) => setDia(e.target.value)} className={selectClass}>
                  <option value="">{h.date.day}</option>
                  {days.map((d) => <option key={d} value={String(d)}>{d}</option>)}
                </select>
                <select value={mes} onChange={(e) => setMes(e.target.value)} className={selectClass}>
                  <option value="">{h.date.month}</option>
                  {h.months.map((m, i) => <option key={m} value={String(i + 1)}>{m}</option>)}
                </select>
                <select value={anio} onChange={(e) => setAnio(e.target.value)} className={selectClass}>
                  <option value="">{h.date.year}</option>
                  {YEARS.map((y) => <option key={y} value={String(y)}>{y}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">{h.fields.lugarNacimiento}</label>
              <input type="text" value={lugarNacimiento} onChange={(e) => setLugarNacimiento(e.target.value)} placeholder={h.placeholders.lugarNacimiento} className={inputClass} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">{h.fields.nacionalidad}</label>
                <input type="text" value={nacionalidad} onChange={(e) => setNacionalidad(e.target.value)} placeholder={h.placeholders.nacionalidad} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">{h.fields.ocupacion}</label>
                <input type="text" value={ocupacion} onChange={(e) => setOcupacion(e.target.value)} placeholder={h.placeholders.ocupacion} className={inputClass} />
              </div>
            </div>

            <Section title={h.sections.direccion} />

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">{h.fields.direccion}</label>
              <input type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder={h.placeholders.direccion} className={inputClass} />
            </div>

            <Section title={h.sections.emergencia} />

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">{h.fields.ceNombre}</label>
              <input type="text" value={ceNombre} onChange={(e) => setCeNombre(e.target.value)} placeholder={h.placeholders.ceNombre} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">{h.fields.ceParentesco}</label>
              <input type="text" value={ceParentesco} onChange={(e) => setCeParentesco(e.target.value)} placeholder={h.placeholders.ceParentesco} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">{h.fields.ceDireccion}</label>
              <input type="text" value={ceDireccion} onChange={(e) => setCeDireccion(e.target.value)} placeholder={h.placeholders.ceDireccion} className={inputClass} />
            </div>

            <button type="button" onClick={handleContinuar} disabled={!canSubmit}
              className="w-full text-white font-semibold py-3 rounded-xl mt-2 transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide"
              style={{ backgroundColor: '#1B4F8A' }}>
              {h.submit}
            </button>
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 mt-5 leading-relaxed">{h.footer}</p>
      </main>
    </div>
  );
}

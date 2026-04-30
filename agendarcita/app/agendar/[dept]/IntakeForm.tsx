'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../i18n/LanguageContext';

type FieldType = 'text' | 'textarea' | 'select';

interface Field {
  key: string;
  type: FieldType;
  ecogOptions?: true;
}

const DEPT_CONFIG: Record<string, Field[]> = {
  oftalmologia: [
    { key: 'av_od_sc', type: 'text' },
    { key: 'av_oi_sc', type: 'text' },
    { key: 'av_od_cc', type: 'text' },
    { key: 'av_oi_cc', type: 'text' },
    { key: 'pio_od', type: 'text' },
    { key: 'pio_oi', type: 'text' },
    { key: 'fondo_ojo', type: 'textarea' },
    { key: 'refraccion', type: 'textarea' },
  ],
  traumatologia: [
    { key: 'mecanismo_lesion', type: 'text' },
    { key: 'zona_afectada', type: 'text' },
    { key: 'eva_dolor', type: 'text' },
    { key: 'pruebas_especiales', type: 'text' },
    { key: 'imagenologia', type: 'text' },
    { key: 'estudios_solicitados', type: 'textarea' },
  ],
  medicina_general: [
    { key: 'motivo_consulta', type: 'textarea' },
    { key: 'duracion_sintomas', type: 'text' },
    { key: 'medicamentos_actuales', type: 'textarea' },
    { key: 'alergias_conocidas', type: 'text' },
  ],
  estetica: [
    { key: 'motivo_consulta_estetica', type: 'textarea' },
    { key: 'area_tratamiento', type: 'text' },
    { key: 'tratamientos_previos', type: 'textarea' },
    { key: 'alergias_conocidas', type: 'text' },
    { key: 'medicamentos_actuales', type: 'text' },
  ],
  oncologia: [
    { key: 'ecog', type: 'select', ecogOptions: true },
    { key: 'tipo_cancer', type: 'text' },
    { key: 'estadificacion', type: 'text' },
    { key: 'protocolo_actual', type: 'text' },
    { key: 'ciclo_actual', type: 'text' },
    { key: 'toxicidades', type: 'textarea' },
    { key: 'laboratorios', type: 'textarea' },
  ],
};

const inputClass =
  'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:border-transparent transition';

export default function IntakeForm({
  dept,
  queryString,
}: {
  dept: string;
  queryString: string;
}) {
  const router = useRouter();
  const { T } = useLanguage();
  const fields = DEPT_CONFIG[dept] ?? [];
  const [values, setValues] = useState<Record<string, string>>({});

  function set(key: string, val: string) {
    setValues((prev) => ({ ...prev, [key]: val }));
  }

  function handleContinuar() {
    sessionStorage.setItem(`intake_${dept}`, JSON.stringify(values));
    router.push(`/agendar/${dept}/calendario?${queryString}`);
  }

  const deptInfo = T.depts[dept as keyof typeof T.depts] as { label: string } | undefined;
  const deptLabel = deptInfo?.label ?? dept;

  const fieldLabels = T.intake.fields as Record<string, string>;
  const ecogOptions = [...T.intake.ecogOptions];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      <main className="max-w-lg mx-auto px-4 py-10">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">
            {T.intake.title} — {deptLabel}
          </h2>
          <p className="text-sm text-gray-400">{T.intake.subtitle}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                {fieldLabels[field.key] ?? field.key}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  rows={3}
                  value={values[field.key] ?? ''}
                  onChange={(e) => set(field.key, e.target.value)}
                  className={inputClass}
                  placeholder="—"
                />
              ) : field.type === 'select' ? (
                <select
                  value={values[field.key] ?? ''}
                  onChange={(e) => set(field.key, e.target.value)}
                  className={inputClass}
                >
                  <option value="">—</option>
                  {ecogOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={values[field.key] ?? ''}
                  onChange={(e) => set(field.key, e.target.value)}
                  className={inputClass}
                  placeholder="—"
                />
              )}
            </div>
          ))}

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ backgroundColor: '#ef4444', color: '#ffffff' }}
            >
              {T.back}
            </button>
            <button
              type="button"
              onClick={handleContinuar}
              className="flex-1 text-white font-semibold py-3 rounded-xl transition-opacity hover:opacity-90 text-sm tracking-wide"
              style={{ backgroundColor: '#1B4F8A' }}
            >
              {T.intake.continuar}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-5">{T.intake.footer}</p>
      </main>
    </div>
  );
}

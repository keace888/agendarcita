'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type FieldType = 'text' | 'textarea' | 'select';

interface Field {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
}

const DEPT_CONFIG: Record<string, Field[]> = {
  oftalmologia: [
    { key: 'av_od_sc', label: 'AV OD s/c', type: 'text' },
    { key: 'av_oi_sc', label: 'AV OI s/c', type: 'text' },
    { key: 'av_od_cc', label: 'AV OD c/c', type: 'text' },
    { key: 'av_oi_cc', label: 'AV OI c/c', type: 'text' },
    { key: 'pio_od', label: 'PIO OD', type: 'text' },
    { key: 'pio_oi', label: 'PIO OI', type: 'text' },
    { key: 'fondo_ojo', label: 'Fondo de ojo', type: 'textarea' },
    { key: 'refraccion', label: 'Refracción / Lensometría', type: 'textarea' },
  ],
  traumatologia: [
    { key: 'mecanismo_lesion', label: 'Mecanismo de lesión', type: 'text' },
    { key: 'zona_afectada', label: 'Zona afectada', type: 'text' },
    { key: 'eva_dolor', label: 'EVA (dolor 0–10)', type: 'text' },
    { key: 'pruebas_especiales', label: 'Pruebas especiales', type: 'text' },
    { key: 'imagenologia', label: 'Imagenología', type: 'text' },
    { key: 'estudios_solicitados', label: 'Estudios solicitados', type: 'textarea' },
  ],
  oncologia: [
    {
      key: 'ecog',
      label: 'Estado funcional (ECOG)',
      type: 'select',
      options: [
        '0 - Asintomático',
        '1 - Síntomas leves',
        '2 - Cama <50% del día',
        '3 - Cama >50% del día',
        '4 - Completamente en cama',
      ],
    },
    { key: 'tipo_cancer', label: 'Tipo de cáncer / Histología', type: 'text' },
    { key: 'estadificacion', label: 'Estadificación', type: 'text' },
    { key: 'protocolo_actual', label: 'Protocolo actual', type: 'text' },
    { key: 'ciclo_actual', label: 'Ciclo actual', type: 'text' },
    { key: 'toxicidades', label: 'Toxicidades / Efectos adversos', type: 'textarea' },
    { key: 'laboratorios', label: 'Laboratorios relevantes', type: 'textarea' },
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
  const fields = DEPT_CONFIG[dept] ?? [];
  const [values, setValues] = useState<Record<string, string>>({});

  function set(key: string, val: string) {
    setValues((prev) => ({ ...prev, [key]: val }));
  }

  function handleContinuar() {
    sessionStorage.setItem(`intake_${dept}`, JSON.stringify(values));
    router.push(`/agendar/${dept}/calendario?${queryString}`);
  }

  const deptLabel =
    dept === 'oftalmologia'
      ? 'Oftalmología'
      : dept === 'traumatologia'
      ? 'Traumatología'
      : 'Oncología';

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      <main className="max-w-lg mx-auto px-4 py-10">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">
            Datos Clínicos — {deptLabel}
          </h2>
          <p className="text-sm text-gray-400">
            Complete la información antes de su cita. El médico la revisará al recibirle.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                {field.label}
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
                  <option value="">Seleccionar...</option>
                  {field.options?.map((opt) => (
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

          <button
            type="button"
            onClick={handleContinuar}
            className="w-full text-white font-semibold py-3 rounded-xl mt-2 transition-opacity hover:opacity-90 text-sm tracking-wide"
            style={{ backgroundColor: '#1B4F8A' }}
          >
            Continuar a Horarios →
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-5">
          Todos los campos son opcionales — puede completarlos en consulta si lo prefiere.
        </p>
      </main>
    </div>
  );
}

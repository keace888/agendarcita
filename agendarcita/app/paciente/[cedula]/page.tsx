import Link from 'next/link';
import Header from '../../components/Header';
import { findPatient } from '@/data/patients';

export default async function PacientePage({
  params,
}: {
  params: Promise<{ cedula: string }>;
}) {
  const { cedula } = await params;
  const patient = findPatient(cedula);
  const displayName = patient ? `${patient.nombre} ${patient.apellido}` : 'Paciente Nuevo';
  const initial = patient ? patient.nombre[0] : '?';

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      <Header />

      <main className="max-w-lg mx-auto px-4 py-8 space-y-4">
        {/* Patient info card */}
        <div className="bg-white rounded-2xl shadow-md p-5 flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
            style={{ backgroundColor: '#1B4F8A' }}
          >
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-800 truncate">{displayName}</p>
            <p className="text-xs text-gray-400">C.I. {cedula}</p>
          </div>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0"
            style={{ backgroundColor: '#d1fae5', color: '#065f46' }}>
            ✓ Verificado
          </span>
        </div>

        {/* Referral status */}
        {patient?.referral ? (
          <div
            className="rounded-2xl p-5 flex items-start gap-3"
            style={{ backgroundColor: '#e8f0fb', border: '1px solid #bfd0ef' }}
          >
            <span className="text-2xl mt-0.5">🫀</span>
            <div>
              <p className="font-semibold text-sm" style={{ color: '#1B4F8A' }}>
                Referencia Activa
              </p>
              <p className="font-bold text-base" style={{ color: '#1a3a6b' }}>
                {patient.referral.department}
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#4a6fa5' }}>
                Referido por: {patient.referral.doctor}
              </p>
            </div>
          </div>
        ) : (
          <div
            className="rounded-2xl p-5 flex items-start gap-3"
            style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a' }}
          >
            <span className="text-2xl mt-0.5">ℹ️</span>
            <div>
              <p className="font-semibold text-sm text-amber-800">Sin Referencia Especializada</p>
              <p className="text-xs text-amber-600 mt-0.5">
                No has sido referido por ningún especialista
              </p>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide pt-1">
          ¿Qué tipo de cita deseas agendar?
        </p>

        <div className="space-y-3">
          {patient?.referral && (
            <Link
              href={`/agendar/${encodeURIComponent(patient.referral.department)}?cedula=${cedula}`}
              className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group"
              style={{ border: '2px solid #1B4F8A' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ backgroundColor: '#e8f0fb' }}
              >
                🫀
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 text-sm">Agendar con Especialista</p>
                <p className="text-xs text-gray-400">{patient.referral.department}</p>
              </div>
              <svg
                width="18" height="18" viewBox="0 0 24 24" fill="#1B4F8A"
                className="group-hover:translate-x-1 transition-transform flex-shrink-0"
              >
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
              </svg>
            </Link>
          )}

          <Link
            href={`/agendar/regular?cedula=${cedula}`}
            className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group"
            style={{ border: '2px solid #e5e7eb' }}
          >
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
              🏥
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800 text-sm">Agendar Visita Regular</p>
              <p className="text-xs text-gray-400">Medicina General, Pediatría, y más</p>
            </div>
            <svg
              width="18" height="18" viewBox="0 0 24 24" fill="#9ca3af"
              className="group-hover:translate-x-1 transition-transform flex-shrink-0"
            >
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
            </svg>
          </Link>
        </div>
      </main>
    </div>
  );
}

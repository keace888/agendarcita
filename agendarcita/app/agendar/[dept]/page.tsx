import Link from 'next/link';
import Header from '../../components/Header';
import { REGULAR_DEPARTMENTS, DEPT_ICONS } from '@/data/patients';
import CalendarPicker from './CalendarPicker';

export default async function AgendarPage({
  params,
  searchParams,
}: {
  params: Promise<{ dept: string }>;
  searchParams: Promise<{ cedula?: string }>;
}) {
  const { dept } = await params;
  const { cedula = '' } = await searchParams;
  const deptName = decodeURIComponent(dept);

  // Regular visit: show department picker
  if (deptName === 'regular') {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
        <Header />
        <main className="max-w-lg mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-6">
            <Link
              href={`/paciente/${cedula}`}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ← Volver
            </Link>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Visita Regular</h2>
              <p className="text-xs text-gray-400">Selecciona el departamento</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {REGULAR_DEPARTMENTS.map((d) => (
              <Link
                key={d}
                href={`/agendar/${encodeURIComponent(d)}?cedula=${cedula}`}
                className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-2 text-center group"
                style={{ border: '2px solid #e5e7eb' }}
              >
                <span className="text-3xl">{DEPT_ICONS[d] ?? '🏥'}</span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700 transition-colors">
                  {d}
                </span>
              </Link>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Specific department: show calendar
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      <Header />
      <main className="max-w-lg mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link
            href={`/paciente/${cedula}`}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ← Volver
          </Link>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {DEPT_ICONS[deptName] ?? '🏥'} {deptName}
            </h2>
            <p className="text-xs text-gray-400">Selecciona un horario disponible</p>
          </div>
        </div>

        <CalendarPicker dept={deptName} cedula={cedula} />
      </main>
    </div>
  );
}

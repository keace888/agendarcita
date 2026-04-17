import Header from '../../../components/Header';
import CalendarPicker from '../CalendarPicker';

export default async function CalendarioPage({
  params,
  searchParams,
}: {
  params: Promise<{ dept: string }>;
  searchParams: Promise<Record<string, string>>;
}) {
  const { dept } = await params;
  const sp = await searchParams;

  const deptLabel =
    dept === 'oftalmologia'
      ? 'Oftalmología'
      : dept === 'traumatologia'
      ? 'Traumatología'
      : 'Oncología';

  const icons: Record<string, string> = {
    oftalmologia: '👁️',
    traumatologia: '🦴',
    oncologia: '🩺',
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      <Header />
      <main className="max-w-lg mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800">
            {icons[dept] ?? '🏥'} {deptLabel}
          </h2>
          <p className="text-xs text-gray-400">Selecciona un horario disponible</p>
        </div>
        <CalendarPicker
          dept={dept}
          cedula={sp.cedula ?? ''}
          nombre={sp.nombre ?? ''}
          apellido={sp.apellido ?? ''}
          email={sp.email ?? ''}
          nacimiento={sp.nacimiento ?? ''}
          sexo={sp.sexo ?? ''}
        />
      </main>
    </div>
  );
}

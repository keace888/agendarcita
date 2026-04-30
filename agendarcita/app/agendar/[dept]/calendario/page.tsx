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

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      <Header />
      <main className="max-w-lg mx-auto px-4 py-8">
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

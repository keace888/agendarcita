import Link from 'next/link';
import Header from '../components/Header';

export default async function VerificandoPage({
  searchParams,
}: {
  searchParams: Promise<{ cedula?: string; telefono?: string }>;
}) {
  const { cedula, telefono } = await searchParams;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      <Header />

      <main className="max-w-md mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-md p-8 text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ backgroundColor: '#e8f0fb' }}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="#1B4F8A">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.557 4.14 1.535 5.874L.057 23.48a.5.5 0 00.613.612l5.652-1.476A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.808 9.808 0 01-5.031-1.386l-.36-.214-3.733.976.997-3.647-.235-.374A9.795 9.795 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
            </svg>
          </div>

          <h2 className="text-lg font-semibold text-gray-800 mb-2">Revisa tu WhatsApp</h2>
          <p className="text-sm text-gray-400 mb-1">
            Enviamos un mensaje de confirmación a:
          </p>
          <p className="font-semibold text-gray-700 mb-5 text-sm">
            {telefono ?? 'tu número de teléfono'}
          </p>
          <p className="text-xs text-gray-400 leading-relaxed mb-8">
            Haz clic en el enlace del mensaje para verificar tu identidad y
            continuar con el agendamiento de tu cita.
          </p>

          {cedula && (
            <Link
              href={`/paciente/${cedula}`}
              className="inline-block w-full text-white font-semibold py-3 rounded-xl text-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#1B4F8A' }}
            >
              Ya verifiqué mi identidad →
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}

import Link from 'next/link';
import Header from '../components/Header';

export default async function VerificandoPage({
  searchParams,
}: {
  searchParams: Promise<{ cedula?: string; email?: string }>;
}) {
  const { cedula, email } = await searchParams;

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
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
          </div>

          <h2 className="text-lg font-semibold text-gray-800 mb-2">Revisa tu Correo</h2>
          <p className="text-sm text-gray-400 mb-1">
            Enviamos un enlace de confirmación a:
          </p>
          <p className="font-semibold text-gray-700 mb-5 text-sm">
            {email ?? 'tu correo electrónico'}
          </p>
          <p className="text-xs text-gray-400 leading-relaxed mb-8">
            Haz clic en el enlace del correo para verificar tu identidad y
            continuar con el agendamiento de tu cita.
          </p>

          <p className="text-xs text-gray-300">
            El enlace del correo te redirigirá automáticamente para continuar.
          </p>
        </div>
      </main>
    </div>
  );
}

export default function Header() {
  return (
    <header style={{ backgroundColor: '#1B4F8A' }} className="py-5 px-4 shadow-lg">
      <div className="max-w-3xl mx-auto flex items-center gap-4">
        <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#1B4F8A">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
          </svg>
        </div>
        <div>
          <p className="text-blue-200 text-xs font-medium tracking-wide uppercase">
            Hospital Domingo Luciani
          </p>
          <h1 className="text-white text-xl font-bold leading-tight">Agendar Cita</h1>
        </div>
      </div>
    </header>
  );
}

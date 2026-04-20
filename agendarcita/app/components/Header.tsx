import Image from 'next/image';

export default function Header() {
  return (
    <header style={{ backgroundColor: '#1B4F8A' }} className="py-5 px-4 shadow-lg">
      <div className="max-w-3xl mx-auto flex items-center gap-4">
        <Image src="/nexa-logo.png" alt="NexaEHR" width={44} height={44} className="flex-shrink-0" />
        <div>
          <p className="text-blue-200 text-xs font-medium tracking-wide">
            NexaEHR
          </p>
          <h1 className="text-white text-xl font-bold leading-tight">Agendar Cita</h1>
        </div>
      </div>
    </header>
  );
}

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from './i18n/LanguageContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NexaEHR — Agendar Cita',
  description: 'Sistema de agendamiento de citas médicas NexaEHR',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.className}>
      <body className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}

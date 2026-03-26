import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Agendar Cita - Hospital Domingo Luciani',
  description: 'Sistema de agendamiento de citas médicas del Hospital Domingo Luciani',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.className}>
      <body className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
        {children}
      </body>
    </html>
  );
}

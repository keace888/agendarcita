import { NextResponse } from 'next/server';
import { sendWhatsApp } from '@/lib/twilio';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://agendarcita.site';

export async function POST(request: Request) {
  const { nombre, cedula, telefono } = await request.json();

  const verifyLink = `${BASE_URL}/paciente/${cedula}?verified=true`;

  try {
    await sendWhatsApp(
      telefono,
      `Hola ${nombre} 👋, para verificar tu identidad y continuar con el agendamiento de tu cita en el *Hospital Domingo Luciani*, haz clic en el siguiente enlace:\n\n${verifyLink}\n\nC.I.: ${cedula}`
    );
  } catch (_) {
    // Don't block the flow if WhatsApp fails
  }

  return NextResponse.json({ success: true });
}

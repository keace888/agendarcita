import { NextResponse } from 'next/server';
import { sendWhatsApp } from '@/lib/twilio';
import { findPatient, DEPT_ICONS } from '@/data/patients';

export async function POST(request: Request) {
  const { cedula, dept, slot } = await request.json();

  const patient = findPatient(cedula);
  if (!patient) {
    return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
  }

  const icon = DEPT_ICONS[dept] ?? '🏥';
  const displayName = `${patient.nombre} ${patient.apellido}`;
  const slotFormatted = slot.replace('-', ' · ');

  try {
    await sendWhatsApp(
      patient.telefono,
      `✅ *Cita Confirmada* – Hospital Domingo Luciani\n\nHola ${displayName}, tu cita ha sido agendada exitosamente:\n\n🏥 *Departamento:* ${icon} ${dept}\n⏰ *Horario:* ${slotFormatted}\n\nPor favor preséntese *15 minutos antes* con su cédula de identidad.`
    );
  } catch (_) {
    // Don't block the flow if WhatsApp fails
  }

  return NextResponse.json({ success: true });
}

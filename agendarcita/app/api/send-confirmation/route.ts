import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { findPatient, DEPT_ICONS } from '@/data/patients';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { cedula, dept, slot } = await request.json();

  const patient = findPatient(cedula);
  if (!patient) {
    return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
  }

  const icon = DEPT_ICONS[dept] ?? '🏥';
  const displayName = `${patient.nombre} ${patient.apellido}`;

  const { error } = await resend.emails.send({
    from: 'Hospital Domingo Luciani <onboarding@resend.dev>',
    to: patient.email,
    subject: `✅ Cita Confirmada – ${dept} · Hospital Domingo Luciani`,
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="margin:0;padding:0;background:#F8FAFC;font-family:'Inter',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:32px 16px;">
          <tr><td align="center">
            <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
              <!-- Header -->
              <tr>
                <td style="background:#1B4F8A;padding:24px 32px;">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="width:40px;height:40px;background:#ffffff;border-radius:50%;text-align:center;vertical-align:middle;">
                        <span style="font-size:20px;">🏥</span>
                      </td>
                      <td style="padding-left:12px;">
                        <p style="margin:0;color:#bfd0ef;font-size:11px;text-transform:uppercase;letter-spacing:1px;">Hospital Domingo Luciani</p>
                        <p style="margin:0;color:#ffffff;font-size:18px;font-weight:700;">Cita Confirmada</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!-- Success banner -->
              <tr>
                <td style="background:#d1fae5;padding:16px 32px;text-align:center;">
                  <p style="margin:0;font-size:15px;font-weight:600;color:#065f46;">✅ Tu cita ha sido agendada exitosamente</p>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding:32px;">
                  <p style="margin:0 0 24px;font-size:15px;color:#6B7280;">
                    Hola <strong style="color:#1A202C;">${displayName}</strong>, aquí están los detalles de tu cita:
                  </p>
                  <!-- Details card -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;border-radius:12px;border:1px solid #E5E7EB;margin-bottom:24px;">
                    <tr>
                      <td style="padding:16px 20px;border-bottom:1px solid #E5E7EB;">
                        <span style="font-size:11px;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.5px;">Paciente</span><br>
                        <span style="font-size:15px;font-weight:600;color:#1A202C;">${displayName}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:16px 20px;border-bottom:1px solid #E5E7EB;">
                        <span style="font-size:11px;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.5px;">Departamento</span><br>
                        <span style="font-size:15px;font-weight:600;color:#1A202C;">${icon} ${dept}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:16px 20px;">
                        <span style="font-size:11px;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.5px;">Horario</span><br>
                        <span style="font-size:15px;font-weight:600;color:#1A202C;">${slot.replace('-', ' · ')}</span>
                      </td>
                    </tr>
                  </table>
                  <p style="margin:0;font-size:13px;color:#6B7280;line-height:1.6;background:#fffbeb;border-radius:8px;padding:12px 16px;border-left:3px solid #f59e0b;">
                    ⏰ Por favor preséntese <strong>15 minutos antes</strong> de su cita con su cédula de identidad.
                  </p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background:#F8FAFC;padding:16px 32px;border-top:1px solid #E5E7EB;">
                  <p style="margin:0;font-size:11px;color:#9CA3AF;text-align:center;">
                    Hospital Domingo Luciani · Sistema de Agendamiento de Citas
                  </p>
                </td>
              </tr>
            </table>
          </td></tr>
        </table>
      </body>
      </html>
    `,
  });

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

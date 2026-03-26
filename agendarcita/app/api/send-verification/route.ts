import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://agendarcita.site';

export async function POST(request: Request) {
  const { nombre, cedula, email } = await request.json();

  const verifyLink = `${BASE_URL}/paciente/${cedula}`;

  const { error } = await resend.emails.send({
    from: 'Hospital Domingo Luciani <onboarding@resend.dev>',
    to: email,
    subject: 'Verifica tu identidad – Hospital Domingo Luciani',
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
                        <p style="margin:0;color:#ffffff;font-size:18px;font-weight:700;">Agendar Cita</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding:32px;">
                  <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1A202C;">Hola, ${nombre} 👋</p>
                  <p style="margin:0 0 24px;font-size:15px;color:#6B7280;line-height:1.6;">
                    Haz clic en el botón a continuación para verificar tu identidad y continuar con el agendamiento de tu cita médica.
                  </p>
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="border-radius:12px;background:#1B4F8A;">
                        <a href="${verifyLink}" style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:12px;">
                          Verificar Identidad →
                        </a>
                      </td>
                    </tr>
                  </table>
                  <p style="margin:24px 0 0;font-size:12px;color:#9CA3AF;line-height:1.6;">
                    Si no solicitaste este correo, puedes ignorarlo. Este enlace expira en 24 horas.<br>
                    C.I.: ${cedula}
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

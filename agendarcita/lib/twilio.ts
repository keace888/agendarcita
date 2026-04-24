const accountSid = process.env.TWILIO_ACCOUNT_SID!
const authToken  = process.env.TWILIO_AUTH_TOKEN!
const from       = process.env.TWILIO_WHATSAPP_FROM! // e.g. whatsapp:+14155238886

export async function sendWhatsApp(telefono: string, body: string): Promise<void> {
  if (!accountSid || !authToken || !from) return

  const trimmed = telefono.trim()
  let e164: string
  if (trimmed.startsWith('+')) {
    e164 = '+' + trimmed.slice(1).replace(/\D/g, '')  // strip formatting, keep country code
  } else if (trimmed.startsWith('00')) {
    e164 = '+' + trimmed.slice(2).replace(/\D/g, '')
  } else {
    const digits = trimmed.replace(/\D/g, '')
    if (digits.startsWith('1') && digits.length === 11) {
      e164 = `+${digits}`                       // US/Canada
    } else if (digits.startsWith('57')) {
      e164 = `+${digits}`                       // Colombia with country code
    } else if (digits.startsWith('58')) {
      e164 = `+${digits}`                       // Venezuela with country code
    } else if (digits.startsWith('0')) {
      e164 = '+58' + digits.slice(1)            // Venezuelan local (04XX → +584XX)
    } else {
      e164 = '+' + digits
    }
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`
  const params = new URLSearchParams({
    From: from,
    To:   `whatsapp:${e164}`,
    Body: body,
  })

  await fetch(url, {
    method:  'POST',
    headers: {
      'Content-Type':  'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
    },
    body: params.toString(),
  })
}

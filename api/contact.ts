type ContactPayload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  consent?: unknown;
  website?: unknown;
  turnstileToken?: unknown;
};

type ApiRequest = {
  method?: string;
  body?: unknown;
  headers: Record<string, string | string[] | undefined>;
};

type ApiResponse = {
  setHeader(name: string, value: string): void;
  status(code: number): ApiResponse;
  json(value: unknown): void;
};

const reply = (res: ApiResponse, status: number, body: unknown) => res.status(status).json(body);
const getHeader = (req: ApiRequest, name: string) => {
  const value = req.headers[name.toLowerCase()];
  return Array.isArray(value) ? value[0] : value;
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'POST') return reply(res, 405, { error: 'Método no permitido.' });

  const origin = getHeader(req, 'origin');
  const expectedOrigin = process.env.PUBLIC_SITE_URL || 'https://woki.pe';
  try {
    const expectedHost = new URL(expectedOrigin).hostname.replace(/^www\./, '');
    const requestHost = origin ? new URL(origin).hostname.replace(/^www\./, '') : '';
    if (!requestHost || requestHost !== expectedHost) return reply(res, 403, { error: 'No se pudo procesar esta solicitud.' });
  } catch {
    return reply(res, 403, { error: 'No se pudo procesar esta solicitud.' });
  }

  const body = (req.body && typeof req.body === 'object' ? req.body : {}) as ContactPayload;
  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 120) : '';
  const email = typeof body.email === 'string' ? body.email.trim().slice(0, 254) : '';
  const message = typeof body.message === 'string' ? body.message.trim().slice(0, 5000) : '';
  const captchaToken = typeof body.turnstileToken === 'string' ? body.turnstileToken : '';

  if (typeof body.website === 'string' && body.website.trim()) return reply(res, 200, { ok: true });
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message || body.consent !== true) {
    return reply(res, 400, { error: 'Revisa tu nombre, correo, mensaje y autorización.' });
  }
  if (!captchaToken) return reply(res, 400, { error: 'Completa la validación CAPTCHA.' });

  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  const resendApiKey = process.env.RESEND_API_KEY;
  const resendFrom = process.env.RESEND_FROM_EMAIL;
  const supportAddress = 'soporte@woki.pe';
  if (!turnstileSecret || !resendApiKey || !resendFrom) {
    return reply(res, 503, { error: 'El formulario aún no está configurado. Escríbenos a soporte@woki.pe.' });
  }

  try {
    const verification = new URLSearchParams({ secret: turnstileSecret, response: captchaToken });
    const clientIp = getHeader(req, 'x-forwarded-for')?.split(',')[0]?.trim();
    if (clientIp) verification.set('remoteip', clientIp);
    const captchaResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: verification,
    });
    const captchaResult = await captchaResponse.json() as { success?: boolean };
    if (!captchaResponse.ok || !captchaResult.success) return reply(res, 400, { error: 'No se pudo validar el CAPTCHA. Intenta de nuevo.' });

    const safeName = name.replace(/[\r\n]+/g, ' ');
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: resendFrom,
        to: [supportAddress],
        reply_to: email,
        subject: `Consulta desde Woki — ${safeName}`,
        text: `Nueva consulta desde el formulario de Woki\n\nNombre: ${safeName}\nCorreo: ${email}\n\nMensaje:\n${message}`,
      }),
    });
    if (!emailResponse.ok) return reply(res, 502, { error: 'No pudimos enviar el mensaje ahora. Intenta de nuevo.' });
    return reply(res, 200, { ok: true });
  } catch {
    return reply(res, 502, { error: 'No pudimos enviar el mensaje ahora. Intenta de nuevo.' });
  }
}

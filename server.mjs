import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';

const root = resolve('/app/dist');
const port = Number(process.env.PORT || 8080);
const siteUrl = process.env.PUBLIC_SITE_URL || 'https://woki.pe';
const rateLimits = new Map();
const mime = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
};

const json = (res, status, body) => {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
  res.end(JSON.stringify(body));
};

async function handleContact(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Método no permitido.' });
  const origin = req.headers.origin;
  try {
    const expectedHost = new URL(siteUrl).hostname.replace(/^www\./, '');
    if (!origin || new URL(origin).hostname.replace(/^www\./, '') !== expectedHost) return json(res, 403, { error: 'No se pudo procesar esta solicitud.' });
  } catch { return json(res, 403, { error: 'No se pudo procesar esta solicitud.' }); }

  const ip = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown').split(',')[0].trim();
  const now = Date.now();
  const recent = (rateLimits.get(ip) || []).filter((time) => now - time < 10 * 60_000);
  if (recent.length >= 5) return json(res, 429, { error: 'Espera unos minutos antes de volver a enviar.' });
  rateLimits.set(ip, [...recent, now]);

  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 16_384) return json(res, 413, { error: 'El mensaje es demasiado largo.' });
  }
  let body;
  try { body = JSON.parse(raw); } catch { return json(res, 400, { error: 'No se pudo leer el formulario.' }); }
  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 120).replace(/[\r\n]+/g, ' ') : '';
  const email = typeof body.email === 'string' ? body.email.trim().slice(0, 254) : '';
  const message = typeof body.message === 'string' ? body.message.trim().slice(0, 5000) : '';
  if (typeof body.website === 'string' && body.website.trim()) return json(res, 200, { ok: true });
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message || body.consent !== true) return json(res, 400, { error: 'Revisa tu nombre, correo, mensaje y autorización.' });
  if (typeof body.turnstileToken !== 'string' || !body.turnstileToken) return json(res, 400, { error: 'Completa la validación CAPTCHA.' });

  const { TURNSTILE_SECRET_KEY: secret, RESEND_API_KEY: resendKey, RESEND_FROM_EMAIL: from } = process.env;
  if (!secret || !resendKey || !from) return json(res, 503, { error: 'El formulario aún no está configurado. Escríbenos a soporte@woki.pe.' });

  try {
    const verification = new URLSearchParams({ secret, response: body.turnstileToken });
    if (ip) verification.set('remoteip', ip);
    const captcha = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: verification,
    });
    if (!captcha.ok || !(await captcha.json()).success) return json(res, 400, { error: 'No se pudo validar el CAPTCHA. Intenta de nuevo.' });

    const sent = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: ['soporte@woki.pe'], reply_to: email, subject: `Consulta desde Woki — ${name}`, text: `Nueva consulta desde el formulario de Woki\n\nNombre: ${name}\nCorreo: ${email}\n\nMensaje:\n${message}` }),
    });
    if (!sent.ok) return json(res, 502, { error: 'No pudimos enviar el mensaje ahora. Intenta de nuevo.' });
    return json(res, 200, { ok: true });
  } catch { return json(res, 502, { error: 'No pudimos enviar el mensaje ahora. Intenta de nuevo.' }); }
}

createServer(async (req, res) => {
  const url = new URL(req.url || '/', 'http://localhost');
  if (url.pathname === '/api/contact') return handleContact(req, res);
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' }); return res.end();
  }
  try {
    let pathname = decodeURIComponent(url.pathname);
    if (pathname.includes('\0')) throw new Error('Invalid path');
    let file = resolve(root, `.${pathname}`);
    if (file !== root && !file.startsWith(`${root}${sep}`)) throw new Error('Invalid path');
    if (!extname(file)) {
      try {
        const info = await stat(file);
        if (info.isDirectory()) file = resolve(file, 'index.html');
        else if (!info.isFile()) throw new Error('Not a file');
      } catch {
        try { await stat(`${file}.html`); file = `${file}.html`; }
        catch { file = resolve(file, 'index.html'); }
      }
    } else if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
    const data = await readFile(file);
    res.writeHead(200, {
      'Content-Type': mime[extname(file)] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-Frame-Options': 'DENY', 'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      ...(file.includes(`${sep}_astro${sep}`) || file.includes(`${sep}images${sep}`) ? { 'Cache-Control': 'public, max-age=31536000, immutable' } : {}),
    });
    res.end(req.method === 'HEAD' ? undefined : data);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff' });
    res.end('No encontrado');
  }
}).listen(port, '0.0.0.0');

// Libro de Reclamaciones: validación, envío al Worker (PUBLIC_COMPLAINTS_ENDPOINT),
// constancia y evento complaint_submit. Contrato: docs/libro-reclamaciones.md.
import { track } from './analytics';

type Field = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export interface ComplaintPayload {
  tipo: 'reclamo' | 'queja';
  consumidor: {
    nombre: string;
    tipoDocumento: string;
    numeroDocumento: string;
    domicilio: string;
    telefono: string;
    correo: string;
    esMenor: boolean;
    apoderado: { nombre: string; documento: string } | null;
  };
  servicio: { tipo: string; fecha: string | null; monto: number | null; descripcion: string };
  detalle: string;
  pedido: string;
  aceptaDeclaracion: true;
  fechaRegistroCliente: string;
  website: string;
}

export interface ComplaintResponse { ok: boolean; numero?: string; fecha?: string; message?: string }

const form = document.querySelector<HTMLFormElement>('[data-complaint-form]');

if (form) {
  const endpoint = form.dataset.endpoint?.trim() ?? '';
  const status = form.querySelector<HTMLElement>('[data-cr-status]');
  const submit = form.querySelector<HTMLButtonElement>('[data-cr-submit]');
  const receipt = document.querySelector<HTMLElement>('[data-cr-receipt]');
  const minor = form.querySelector<HTMLInputElement>('[data-cr-minor]');
  const guardian = form.querySelector<HTMLElement>('[data-cr-guardian]');
  const fields = Array.from(form.querySelectorAll<Field>('[data-cr-field]'));
  const field = (name: string) => fields.find((item) => item.dataset.crField === name);
  const value = (name: string) => (field(name)?.value ?? '').trim();
  const todayEl = form.querySelector<HTMLTimeElement>('[data-cr-today]');

  // La fecha visible es la del dispositivo; la fecha oficial la asigna el Worker.
  if (todayEl) {
    const now = new Date();
    todayEl.dateTime = now.toISOString().slice(0, 10);
    todayEl.textContent = now.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  const setError = (name: string, message: string) => {
    const input = field(name);
    const error = form.querySelector<HTMLElement>(`[data-cr-error="${name}"]`);
    input?.setAttribute('aria-invalid', 'true');
    input?.classList.add('is-invalid');
    if (error) { error.textContent = message; error.hidden = false; }
  };
  const clearError = (name: string) => {
    const input = field(name);
    const error = form.querySelector<HTMLElement>(`[data-cr-error="${name}"]`);
    input?.removeAttribute('aria-invalid');
    input?.classList.remove('is-invalid');
    if (error) { error.textContent = ''; error.hidden = true; }
  };

  fields.forEach((input) => {
    const event = input instanceof HTMLSelectElement || (input instanceof HTMLInputElement && input.type === 'checkbox') ? 'change' : 'input';
    input.addEventListener(event, () => clearError(input.dataset.crField ?? ''));
  });

  minor?.addEventListener('change', () => {
    if (!guardian) return;
    guardian.hidden = !minor.checked;
    ['apoderadoNombre', 'apoderadoDocumento'].forEach((name) => {
      const input = field(name);
      if (input) input.required = minor.checked;
      if (!minor.checked) clearError(name);
    });
  });

  const documentPattern: Record<string, RegExp> = {
    DNI: /^\d{8}$/,
    'Carné de extranjería': /^[A-Za-z0-9]{8,12}$/,
    Pasaporte: /^[A-Za-z0-9]{6,12}$/,
  };

  const validate = () => {
    const errors: [string, string][] = [];
    const required: [string, string][] = [
      ['nombre', 'Ingresa tus nombres y apellidos.'],
      ['domicilio', 'Ingresa tu domicilio.'],
      ['descripcionServicio', 'Describe brevemente el servicio.'],
      ['detalle', 'Cuéntanos qué pasó.'],
      ['pedido', 'Indica qué solicitas.'],
    ];
    for (const [name, message] of required) if (!value(name)) errors.push([name, message]);

    const docType = value('tipoDocumento');
    const docNumber = value('numeroDocumento');
    if (!docNumber) errors.push(['numeroDocumento', 'Ingresa tu número de documento.']);
    else if (documentPattern[docType] && !documentPattern[docType].test(docNumber)) {
      errors.push(['numeroDocumento', docType === 'DNI' ? 'El DNI debe tener 8 dígitos.' : 'Revisa el número de documento.']);
    }

    const phone = value('telefono').replace(/[\s-]/g, '');
    if (!/^\+?\d{6,15}$/.test(phone)) errors.push(['telefono', 'Ingresa un teléfono válido.']);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value('correo'))) errors.push(['correo', 'Ingresa un correo electrónico válido.']);

    const amount = value('monto');
    if (amount && (Number.isNaN(Number(amount)) || Number(amount) < 0)) errors.push(['monto', 'Ingresa un monto válido.']);

    if (minor?.checked) {
      if (!value('apoderadoNombre')) errors.push(['apoderadoNombre', 'Ingresa el nombre de tu padre, madre o apoderado.']);
      if (!value('apoderadoDocumento')) errors.push(['apoderadoDocumento', 'Ingresa el documento del apoderado.']);
    }

    const declaration = field('declaracion');
    if (declaration instanceof HTMLInputElement && !declaration.checked) errors.push(['declaracion', 'Debes aceptar la declaración para enviar la hoja.']);

    fields.forEach((input) => clearError(input.dataset.crField ?? ''));
    errors.forEach(([name, message]) => setError(name, message));
    if (errors.length) field(errors[0][0])?.focus();
    return errors.length === 0;
  };

  const selectedType = () => form.querySelector<HTMLInputElement>('[data-cr-type]:checked')?.value === 'queja' ? 'queja' : 'reclamo';

  const buildPayload = (): ComplaintPayload => ({
    tipo: selectedType(),
    consumidor: {
      nombre: value('nombre'),
      tipoDocumento: value('tipoDocumento'),
      numeroDocumento: value('numeroDocumento'),
      domicilio: value('domicilio'),
      telefono: value('telefono'),
      correo: value('correo'),
      esMenor: Boolean(minor?.checked),
      apoderado: minor?.checked ? { nombre: value('apoderadoNombre'), documento: value('apoderadoDocumento') } : null,
    },
    servicio: {
      tipo: value('servicio'),
      fecha: value('fechaServicio') || null,
      monto: value('monto') ? Number(value('monto')) : null,
      descripcion: value('descripcionServicio'),
    },
    detalle: value('detalle'),
    pedido: value('pedido'),
    aceptaDeclaracion: true,
    fechaRegistroCliente: new Date().toISOString(),
    website: (form.querySelector<HTMLInputElement>('input[name="website"]')?.value ?? '').trim(),
  });

  const showReceipt = (payload: ComplaintPayload, response: ComplaintResponse) => {
    if (!receipt) return;
    const set = (selector: string, text: string) => { const el = receipt.querySelector(selector); if (el) el.textContent = text; };
    set('[data-cr-number]', response.numero ?? '—');
    set('[data-cr-date]', response.fecha ? new Date(response.fecha).toLocaleString('es-PE') : new Date().toLocaleString('es-PE'));
    set('[data-cr-kind]', payload.tipo === 'queja' ? 'Queja' : 'Reclamo');
    set('[data-cr-email]', payload.consumidor.correo);
    form.hidden = true;
    receipt.hidden = false;
    receipt.focus();
    receipt.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  receipt?.querySelector('[data-cr-print]')?.addEventListener('click', () => window.print());

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!endpoint || !submit) return;
    if (!validate()) return;
    const payload = buildPayload();
    if (payload.website) return; // honeypot

    submit.disabled = true;
    const label = submit.textContent;
    submit.textContent = form.dataset.sendingLabel ?? 'Enviando…';
    if (status) status.textContent = '';
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await response.json().catch(() => ({}))) as ComplaintResponse;
      if (!response.ok || !data.ok || !data.numero) throw new Error(data.message ?? 'No se pudo registrar la hoja.');
      track('complaint_submit', { cta_label: payload.tipo, cta_location: 'libro_reclamaciones' });
      showReceipt(payload, data);
    } catch {
      if (status) status.textContent = form.dataset.errorMessage ?? '';
      submit.disabled = false;
      submit.textContent = label;
    }
  });
}

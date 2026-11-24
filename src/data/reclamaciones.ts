import { brand, breadcrumbLabels, routes } from './site';

/**
 * Libro de Reclamaciones virtual.
 *
 * El formulario envía la hoja a `PUBLIC_COMPLAINTS_ENDPOINT` (un Cloudflare Worker).
 * El Worker asigna el número correlativo, guarda el registro y envía los correos.
 * El contrato del envío está en `docs/libro-reclamaciones.md`.
 * Sin endpoint, la página explica que el libro virtual aún no recibe hojas y
 * ofrece el correo de soporte.
 */

/**
 * Titular del servicio (persona natural). Debe completarse antes de publicar el libro:
 * la hoja de reclamación tiene que identificar al proveedor.
 * `pending: true` muestra el aviso "por definir" en la página.
 */
export const complaintsProvider = {
  pending: true,
  holderType: 'Persona natural',
  name: '[Nombre del titular por definir]',
  ruc: '[RUC por definir]',
  address: `[Domicilio por definir], ${brand.city}, ${brand.region}, ${brand.country}`,
  commercialName: brand.projectName,
  email: brand.email,
} as const;

/** Plazo legal de respuesta (Código de Protección y Defensa del Consumidor, tras la Ley 31435). */
export const complaintsResponseDays = 15;

export const complaintsPage = {
  path: routes.complaints,
  crumb: breadcrumbLabels.complaints,
  title: `Libro de Reclamaciones | ${brand.name}`,
  description: `Registra un reclamo o una queja sobre el servicio de ${brand.name} en ${brand.city}. Recibirás tu número de hoja y respuesta en un máximo de ${complaintsResponseDays} días hábiles.`,
  hero: {
    kicker: 'Libro de Reclamaciones virtual',
    titleLead: 'Tu opinión nos ayuda',
    titleAccent: 'a mejorar cada viaje.',
    lead: `Registra tu reclamo o queja. Te enviaremos una copia de tu hoja al correo y te responderemos en un máximo de ${complaintsResponseDays} días hábiles.`,
  },
  types: [
    {
      value: 'reclamo',
      label: 'Reclamo',
      description: 'Disconformidad relacionada con el servicio contratado (por ejemplo, un cobro o un viaje que no se realizó como se acordó).',
    },
    {
      value: 'queja',
      label: 'Queja',
      description: 'Malestar o descontento con la atención al público, no relacionado directamente con el servicio contratado.',
    },
  ],
  documentTypes: ['DNI', 'Carné de extranjería', 'Pasaporte'],
  services: ['Viaje como pasajero', 'Servicio como conductor', 'Atención o soporte', 'Otro'],
  steps: [
    { title: 'Tus datos', description: 'Identificación y datos de contacto.' },
    { title: 'El servicio', description: 'Qué contrataste y cuándo.' },
    { title: 'Tu reclamo', description: 'Qué pasó y qué solicitas.' },
  ],
  after: [
    { title: 'Recibes tu constancia', description: 'Te mostramos el número de hoja y te enviamos una copia a tu correo.' },
    { title: 'Revisamos tu caso', description: 'Podemos escribirte si necesitamos más información.' },
    { title: `Te respondemos en máx. ${complaintsResponseDays} días hábiles`, description: 'La respuesta llega al correo que registraste.' },
  ],
  notes: [
    'La formulación del reclamo no impide acudir a otras vías de solución de controversias ni es requisito previo para interponer una denuncia ante el INDECOPI.',
    `El proveedor deberá dar respuesta al reclamo en un plazo no mayor a ${complaintsResponseDays} días hábiles.`,
  ],
  form: {
    submit: 'Enviar hoja de reclamación',
    sending: 'Enviando tu hoja…',
    unavailable: `El libro virtual aún no está habilitado para recibir hojas en línea. Mientras tanto, escribe tu reclamo o queja a ${brand.email} indicando tus datos y lo que solicitas.`,
    error: `No pudimos registrar tu hoja ahora. Inténtalo de nuevo en unos minutos o escribe a ${brand.email}.`,
    declaration: 'Declaro que los datos consignados son verdaderos y autorizo su uso para atender este reclamo o queja, conforme a la',
  },
} as const;

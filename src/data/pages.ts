import { brand, breadcrumbLabels, routes } from './site';
import { driverPaymentOptions, driverRequirements, passengerFinalDestination } from './content';
import { driverPlans, homeDemoTrip } from './home';

/**
 * Textos de las subpáginas (Seguridad, Conductores, Cómo funciona, Nosotros,
 * Contacto y legales). Las listas de contenido (pasos, herramientas, FAQ…)
 * viven en `content.ts`; aquí están los encabezados, CTA y datos de ejemplo
 * de cada sección.
 */

/** Convierte un texto en snake_case para `data-track-label`. */
export function toTrackLabel(text: string) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

export interface PageAction { href: string; label: string; track: string }
export interface PageNavItem { id: string; label: string }

/* ---------------------------------------------------------------- Seguridad */

export const safetyPage = {
  path: routes.safety,
  crumb: breadcrumbLabels.safety,
  title: 'Seguridad en tus viajes | Woki',
  description: `Consulta la información del taxi, confirma el viaje con un PIN y sigue el recorrido en ${brand.city}.`,
  jsonLdName: 'Pasajero en Woki',
  hero: {
    eyebrow: 'Para pasajeros',
    titleLead: 'Viaja tranquilo:',
    titleAccent: 'sabes quién te recoge.',
    lead: `Compara los datos del taxi, confirma el inicio con un PIN único y consulta la ruta durante el viaje en ${brand.city}.`,
    secondary: { href: routes.howItWorks, label: 'Ver cómo funciona', track: 'ver_como_funciona' },
    compareTitle: 'Antes de subir, compara:',
    compare: [
      { label: 'Conductor', value: homeDemoTrip.driver.name },
      { label: 'Vehículo', value: homeDemoTrip.driver.car },
    ],
    plateLabel: 'Placa',
    pinLabel: 'Tu PIN de viaje',
  },
  nav: [
    { id: 'recorrido', label: 'Tu viaje' },
    { id: 'herramientas', label: 'Herramientas' },
    { id: 'si-algo-no-coincide', label: 'Si algo no coincide' },
    { id: 'pago', label: 'Pagos' },
    { id: 'dudas', label: 'Preguntas' },
  ] satisfies PageNavItem[],
  journey: { kicker: 'Tu viaje, paso a paso', initialStep: 2 },
  tools: {
    kicker: 'Herramientas para tu viaje',
    title: 'Tu seguridad, herramienta por herramienta',
    lead: 'Recursos para reconocer el servicio, coordinar el recorrido y compartir una referencia clara.',
    featured: 'PIN por viaje',
  },
  mismatch: {
    title: '¿Algo no coincide? No subas.',
    text: 'Revisa conductor, vehículo y placa en la app. Si tienes dudas, escríbenos y te ayudamos.',
    action: `Escribir a ${brand.email}`,
  },
  payments: {
    kicker: 'Al llegar a destino',
    title: 'Pagar es simple',
    lead: 'Elige el medio que te resulte más cómodo y coordina los detalles antes de terminar el viaje.',
    featured: 'Billetera digital',
    wallets: ['Yape', 'Plin'],
  },
  faq: { kicker: 'Dudas', title: 'Preguntas de pasajeros', lead: 'Respuestas sobre tus viajes como pasajero en Woki.' },
  cta: {
    title: passengerFinalDestination.title,
    text: passengerFinalDestination.text,
    actions: [
      { href: passengerFinalDestination.primaryHref, label: passengerFinalDestination.primaryLabel, track: 'ver_como_funciona' },
      { href: passengerFinalDestination.secondaryHref, label: passengerFinalDestination.secondaryLabel, track: 'contacto' },
    ] satisfies PageAction[],
  },
} as const;

/* -------------------------------------------------------------- Conductores */

const [commissionPlan, monthlyPlan] = driverPlans;
const [commissionOption, monthlyOption] = driverPaymentOptions;

export const driversPage = {
  path: routes.drivers,
  crumb: breadcrumbLabels.drivers,
  title: `Conduce con Woki en ${brand.city}`,
  description: `Conduce taxi con Woki en ${brand.city}: revisa solicitudes, tarifas y actividad desde la app. Conoce los pasos para empezar.`,
  jsonLdName: 'Conduce con Woki',
  hero: {
    eyebrow: 'Para quienes conducen',
    titleLead: 'Conduce con Woki',
    titleAccent: 'a tu manera.',
    lead: 'Conéctate cuando quieras, revisa cada solicitud y elige tu plan.',
    primary: { href: '#registro-conductor', label: 'Regístrate como conductor', track: 'registro_conductor' },
    secondary: { href: '#planes', label: 'Ver planes', track: 'ver_planes' },
    imageAlt: `Conductor de Woki sonriendo al volante de su taxi en ${brand.city}`,
    request: { tag: 'Nueva solicitud', fare: homeDemoTrip.fare, place: 'Plaza Chaupimarca', meta: '0.8 km · Yape', accept: 'Aceptar', adjustments: ['+S/1', '+S/2'] },
  },
  nav: [
    { id: 'dia', label: 'Tu día' },
    { id: 'planes', label: 'Planes' },
    { id: 'registro-conductor', label: 'Requisitos' },
    { id: 'seguridad-conductor', label: 'Seguridad' },
    { id: 'dudas', label: 'Preguntas' },
  ] satisfies PageNavItem[],
  day: {
    kicker: 'Tu día con Woki',
    title: 'Tú decides cuándo y qué viajes',
    lead: 'Conéctate, revisa, ajusta tu tarifa y cierra el día con tus números a la vista.',
    online: 'En línea',
    earnings: { label: 'Ganado hoy', value: 42 },
  },
  plans: {
    kicker: 'Planes para conductores',
    title: 'Elige cómo pagar por usar Woki',
    lead: 'Dos modelos simples, según la frecuencia con la que conduces.',
    items: [
      { ...commissionPlan, unit: 'por cada viaje completado', bullets: commissionOption.bullets?.slice(1) ?? [], action: { href: '#registro-conductor', label: 'Empezar con comisión de 15 %', track: 'plan_comision' } },
      { ...monthlyPlan, unit: 'cuota fija al cierre de cada mes', bullets: monthlyOption.bullets?.slice(1) ?? [], action: { href: '#registro-conductor', label: 'Empezar con plan mensual', track: 'plan_mensual' } },
    ],
    note: 'Las condiciones vigentes se confirman en la app antes de que empieces a conducir.',
  },
  register: {
    kicker: driverRequirements.title,
    title: 'Ten listos estos documentos',
    lead: 'Prepáralos para enviar tu perfil a revisión desde la app.',
    stepsTitle: `Regístrate en ${driverRequirements.steps.length} pasos`,
    action: { href: '#descargar', label: 'Descargar la app y registrarme', track: 'descargar_registro' },
  },
  safety: { kicker: 'Un viaje claro para ambos', title: 'Tu seguridad también importa', highlight: 'Soporte 24/7' },
  faq: { kicker: 'Dudas', title: 'Preguntas de conductores', lead: 'Registro, pagos y cómo es conducir con Woki.' },
  cta: {
    titleLead: 'Tu taxi, tus horarios.',
    titleAccent: 'Empieza con Woki.',
    text: 'Prepara tus documentos y regístrate desde la app.',
    actions: [{ href: routes.contact, label: 'Tengo dudas', track: 'contacto' }] satisfies PageAction[],
  },
  stickyBar: {
    title: `${commissionPlan.price} o ${monthlyPlan.price} al mes`,
    text: 'Tú eliges tu plan',
    action: { href: '#registro-conductor', label: 'Quiero conducir', track: 'quiero_conducir' },
  },
} as const;

/* ------------------------------------------------------------ Cómo funciona */

export const howItWorksPage = {
  path: routes.howItWorks,
  crumb: breadcrumbLabels.howItWorks,
  title: `Cómo funciona Woki | Taxi en ${brand.city}`,
  description: `Descubre cómo pedir un taxi Woki en ${brand.city}, revisar cada viaje y conocer su tarifa. Explora los pasos para pasajeros y conductores.`,
  jsonLdName: 'Cómo funciona Woki',
  hero: {
    eyebrow: 'Tu recorrido, paso a paso',
    title: '¿Cómo funciona Woki?',
    lead: 'Un mismo viaje, dos lados. Mira qué hace el pasajero, qué hace el conductor y cómo el PIN los une en el momento clave.',
  },
  lanes: {
    title: 'El viaje desde ambos lados',
    intro: `Woki conecta a quienes necesitan un taxi con conductores de ${brand.city}. Pasajero y conductor tienen distintos pasos, pero comparten una referencia clara para iniciar y completar el viaje.`,
    passenger: 'Pasajero',
    driver: 'Conductor',
    rows: [
      { marker: 'Solicitud', kind: 'step', passenger: { title: 'Pide el viaje', text: 'Indica recogida, destino y una referencia local para que el conductor te ubique.' }, driver: { title: 'Recibe la solicitud', text: 'Ve recogida, destino, distancia, tiempo y forma de pago.' } },
      { marker: 'Revisión', kind: 'step', passenger: { title: 'Ve la tarifa', text: 'Sabe cuánto pagará antes de confirmar. Sin sorpresas al llegar.' }, driver: { title: 'Acepta o ajusta', text: 'Acepta la propuesta o suma +S/1, +S/2 o +S/3 antes de decidir.' } },
      { marker: 'PIN compartido', kind: 'pin', passenger: { title: 'Verifica y comparte el PIN', text: 'Compara conductor, vehículo y placa antes de subir.' }, driver: { title: 'Ingresa el PIN', text: 'Solo así se inicia el viaje correcto.' } },
      { marker: 'Destino', kind: 'end', passenger: { title: 'Llega, paga y califica', text: 'Efectivo o billetera digital, directo al conductor. Luego deja tu reseña.' }, driver: { title: 'Cobra y suma a su día', text: 'Ve lo ganado hoy y su porcentaje de aceptación.' } },
    ],
    note: 'Los ejemplos son ilustrativos; las opciones disponibles se muestran dentro de la aplicación.',
  },
  guides: {
    kicker: 'Guías detalladas',
    title: 'Elige tu lado del viaje',
    items: [
      {
        tone: 'light',
        eyebrow: 'Para pasajeros',
        title: 'Pide, verifica y viaja',
        steps: ['Consulta las reseñas de otros pasajeros.', 'Sigue en el mapa cuánto falta para que llegue el taxi.', 'Coordina el punto de encuentro por chat o llamada desde la app.', 'Si los datos del taxi no coinciden, no subas y contacta a soporte.'],
        action: { href: routes.safety, label: 'Ver la guía para pasajeros', track: 'guia_pasajeros' },
      },
      {
        tone: 'dark',
        eyebrow: 'Para conductores',
        title: 'Revisa y decide',
        steps: ['Prepara DNI, licencia, SOAT, inspección técnica y tarjeta de propiedad.', 'Envía los documentos y espera la revisión de tu perfil.', 'Conéctate cuando estés listo: no hay horario fijo.', 'Elige entre comisión por viaje (15 %) y plan mensual (S/ 50).'],
        action: { href: routes.drivers, label: 'Ver la guía para conductores', track: 'guia_conductores' },
      },
    ],
    contactLead: '¿Tienes una duda sobre las funciones?',
    contact: { href: routes.contact, label: 'Escríbenos desde Contacto', track: 'contacto' },
  },
} as const;

/* ----------------------------------------------------------------- Nosotros */

export const aboutPage = {
  path: routes.about,
  crumb: breadcrumbLabels.about,
  title: `Nosotros | ${brand.name}`,
  description: `Conoce Woki, plataforma de taxi urbano en ${brand.city}. Descubre nuestra misión y visión, y cómo conectamos a pasajeros con conductores locales.`,
  hero: {
    eyebrow: 'Quiénes somos',
    titleLead: 'La ciudad se mueve mejor cuando',
    titleAccent: 'nos acercamos.',
    city: brand.city,
    region: `${brand.region} · ${brand.country}`,
  },
  purpose: { mission: 'Misión', vision: 'Visión', title: 'Nuestro propósito' },
  values: { kicker: 'Lo que nos guía', title: 'Cuatro valores, un mismo viaje' },
  principles: {
    kicker: '¿Cómo trabajamos?',
    title: 'Tecnología útil, hecha para moverse por aquí',
    lead: `Creemos que pedir un taxi puede ser claro desde el primer toque: saber quién viene, compartir los datos del viaje y llegar con más tranquilidad. Por eso construimos ${brand.name} para conectar a la comunidad con herramientas digitales prácticas.`,
  },
  cta: {
    title: `¿Quieres ser parte de cómo se mueve ${brand.city}?`,
    actions: [{ href: routes.drivers, label: 'Conducir con Woki', track: 'conducir_con_woki' }] satisfies PageAction[],
  },
} as const;

/* ----------------------------------------------------------------- Contacto */

export const contactPage = {
  path: routes.contact,
  crumb: breadcrumbLabels.contact,
  title: `Contáctanos | ${brand.name}`,
  description: `Contacta a Woki por consultas sobre taxis en ${brand.city} o información para conductores. Revisa el estado actual de nuestros canales de contacto.`,
  hero: {
    titleLead: '¿Tienes algo en mente?',
    titleAccent: 'Hablemos.',
    lead: 'Te orientamos sobre tus viajes, el registro de conductores o cualquier consulta sobre Woki.',
  },
  needs: {
    title: '¿Qué necesitas?',
    items: [
      { href: `${routes.safety}#dudas`, label: 'Dudas sobre un viaje', track: 'dudas_viaje' },
      { href: `${routes.drivers}#registro-conductor`, label: 'Quiero ser conductor', track: 'quiero_ser_conductor' },
      { href: routes.accountDeletion, label: 'Eliminar mi cuenta', track: 'eliminar_cuenta' },
    ] satisfies PageAction[],
  },
  channels: { support: 'Soporte · 24/7', legal: 'Legal y privacidad', location: 'Ubicación' },
  form: {
    title: 'Cuéntanos cómo podemos ayudarte',
    intro: 'Usaremos tus datos solo para responderte. Revisa la',
    consent: `Acepto que ${brand.projectName} trate mis datos para responder esta consulta.`,
    submitEndpoint: 'Enviar consulta',
  },
} as const;

/* ------------------------------------------------------------------ Legales */

export const legalPage = {
  eyebrow: 'Información legal',
  lead: 'Condiciones de uso, privacidad y políticas de Woki, escritas para que se entiendan.',
  navTitle: 'Documentos',
  tocTitle: 'En este documento',
  help: { title: '¿Dudas legales?', text: 'Escríbenos y te respondemos.' },
  updatedLabel: 'Actualizado:',
} as const;

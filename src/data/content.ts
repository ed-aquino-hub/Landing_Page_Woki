import { brand } from './site';

export interface ContentItem {
  title: string;
  description: string;
}

export interface IconItem extends ContentItem {
  iconPath: string;
}

export interface JourneyStep extends ContentItem {
  detail?: string;
  visual?:
    | { type: 'pills'; items: string[] }
    | { type: 'pin'; label: string; value: string }
    | { type: 'fare'; base: number; currency: string; adjustments: number[]; label: string }
    | { type: 'checks'; items: string[] }
    | { type: 'earnings'; items: string[] };
}

export interface QuestionItem { question: string; answer: string }
export interface LabeledItem extends ContentItem { iconPath?: string; bullets?: string[] }

export const passengerJourneyTitle = 'Así es un viaje con Woki';
export const passengerJourneySubtitle = 'Desde que pides el taxi hasta que llegas, sabes qué sigue en cada momento.';
export const passengerJourney: JourneyStep[] = [
  { title: 'Pides en segundos', description: 'Dices dónde estás y a dónde vas. Nada más.', detail: 'Puedes añadir una referencia, por ejemplo “frente al grifo”, para que el conductor te ubique mejor.', visual: { type: 'pills', items: ['Recogida', 'Destino', 'Referencia opcional'] } },
  { title: 'Verificas antes de subir', description: 'Compara con lo que ves en tu pantalla.', detail: 'Ves nombre, vehículo y placa del conductor asignado. Si algo no coincide, no subas.', visual: { type: 'checks', items: ['Conductor', 'Vehículo', 'Placa'] } },
  { title: 'Confirmas con tu PIN', description: 'Solo el conductor correcto puede iniciar tu viaje.', detail: 'El PIN es único para cada viaje. Dáselo al conductor para confirmar que es el viaje correcto.', visual: { type: 'pin', label: 'PIN de ejemplo', value: brand.demoPin } },
  { title: 'Llegas, pagas y calificas', description: 'Efectivo o Yape. Tu reseña ayuda a otros.', detail: 'Puedes seguir el recorrido, escribir o llamar desde la app. Al terminar, calificas al conductor.', visual: { type: 'pills', items: ['Efectivo', 'Yape', '★★★★★'] } },
];

export const passengerSafetyTools: LabeledItem[] = [
  { title: 'Conductor verificado', description: 'Revisamos licencia, SOAT y datos del vehículo.', iconPath: 'M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3zM9 12l2 2 4-4' },
  { title: 'PIN por viaje', description: 'Un código único que confirma que subes al taxi correcto.', iconPath: 'M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3zM9.5 12.5V11a2.5 2.5 0 015 0v1.5M9 12.5h6v4H9z' },
  { title: 'Seguimiento en tiempo real', description: 'Mira el mapa y cuánto falta para llegar.', iconPath: 'M12 21s-7-6-7-11a7 7 0 0114 0c0 5-7 11-7 11zM12 10m-2.5 0a2.5 2.5 0 105 0 2.5 2.5 0 10-5 0' },
  { title: 'Chat y llamada', description: 'Habla con tu conductor sin salir de la app.', iconPath: 'M5 5h14a2 2 0 012 2v8a2 2 0 01-2 2h-7l-5 4v-4H5a2 2 0 01-2-2V7a2 2 0 012-2z' },
  { title: 'Reseñas reales', description: 'Consulta las calificaciones de otros pasajeros.', iconPath: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z' },
];

export const passengerSituations: LabeledItem[] = [
  { title: 'Si viajas de noche', description: 'Compara conductor, vehículo y placa, y confirma con el PIN antes de subir.' },
  { title: 'Si es tu primera vez', description: 'Ves los datos del viaje antes de confirmar. Sin sorpresas.' },
  { title: 'Si alguien te espera', description: 'El seguimiento te dice cuánto falta para llegar.' },
];

export const paymentOptions: LabeledItem[] = [
  { title: 'Efectivo', description: 'Paga directamente al conductor al finalizar el viaje. Ten listo el monto acordado para cerrar el recorrido con facilidad.', iconPath: 'M3 7.5h18v11H3zM3 7.5l2-3h14l2 3M16 13h2M7 11v4' },
  { title: 'Billetera digital', description: 'Yape, Plin y otros. Coordina con el conductor qué billetera digital está disponible antes de iniciar el viaje.', iconPath: 'M7 2.75h10a1.5 1.5 0 011.5 1.5v15.5a1.5 1.5 0 01-1.5 1.5H7a1.5 1.5 0 01-1.5-1.5V4.25A1.5 1.5 0 017 2.75zM9 6h6M10 18h4' },
];

export const driverPaymentOptions: LabeledItem[] = [
  { title: 'Comisión por viaje · 15 %', description: 'Una opción flexible para adaptar el pago a la cantidad de viajes que realizas.', bullets: ['Pagas el 15 % por cada viaje completado.', 'Pensado para quienes conducen ocasionalmente.'], iconPath: 'M12 2.75a9.25 9.25 0 100 18.5 9.25 9.25 0 000-18.5zM8 16l8-8M8.5 8.5h.01M15.5 15.5h.01' },
  { title: 'Plan mensual · S/ 50', description: 'Una cuota fija para organizar el costo del servicio durante el mes.', bullets: ['Pagas S/ 50 al cierre de cada mes.', 'Puede convenirte si conduces a diario.'], iconPath: 'M6 3v3M18 3v3M4 8h16M5 5h14a1 1 0 011 1v13H4V6a1 1 0 011-1zM8 12h3M8 16h3' },
];

export const passengerFaqs: QuestionItem[] = [
  { question: `¿Dónde funciona ${brand.name}?`, answer: `${brand.name} está disponible en ${brand.city} y alrededores. Pronto llegaremos a más ciudades.` },
  { question: '¿Cómo sé que mi conductor es de confianza?', answer: 'Todos los conductores son verificados: licencia, SOAT y datos del vehículo. Además, cada viaje usa un PIN de seguridad y puedes ver las reseñas de otros pasajeros.' },
  { question: '¿Cómo pago mi viaje?', answer: 'Puedes pagar en efectivo o con Yape directamente al conductor.' },
  { question: '¿Puedo seguir mi viaje?', answer: 'Sí. Ves al conductor en el mapa y el tiempo de llegada.' },
  { question: '¿Puedo hablar con mi conductor?', answer: 'Sí, por chat o llamada desde la app.' },
  { question: '¿Qué hago si algo no coincide?', answer: 'No subas. Revisa conductor, vehículo y placa en la app y escríbenos a soporte@woki.pe.' },
];

export const driverJourneyTitle = 'Así se ve tu día con Woki';
export const driverJourneySubtitle = 'Tú decides cuándo conectarte, qué solicitudes aceptar y cómo organizar tus viajes.';
export const driverJourney: JourneyStep[] = [
  { title: 'Te conectas cuando quieras', description: 'Activas “En línea” y recibes solicitudes cerca de ti.', detail: 'Puedes conectarte y desconectarte cuando quieras. No hay horarios fijos.', visual: { type: 'pills', items: ['En línea', 'Sin horarios fijos'] } },
  { title: 'Ves el viaje completo', description: 'Antes de aceptar, todo está a la vista.', detail: 'Recogida, destino, distancia, tiempo y forma de pago, antes de decidir si aceptas.', visual: { type: 'pills', items: ['Recogida', 'Destino', 'Distancia', 'Tiempo', 'Forma de pago'] } },
  { title: 'Participas en tu tarifa', description: 'Acepta la propuesta o súmale un poco.', detail: 'Revisa la propuesta y elige si la aceptas o ajustas con las opciones disponibles.', visual: { type: 'fare', base: 8, currency: 'S/', adjustments: [1, 2, 3], label: 'Tarifa de ejemplo' } },
  { title: 'Cierras con tus números', description: 'Lo ganado hoy y tu porcentaje de aceptación, a la vista.', detail: 'Consultas lo ganado en el día y tu porcentaje de aceptación.', visual: { type: 'earnings', items: ['Ganado hoy', '% aceptación'] } },
];

export const driverRequestExample = {
  title: 'Lo que ves en cada solicitud',
  subtitle: 'Revisa los datos del viaje antes de decidir si lo aceptas.',
  tag: 'Solicitud de ejemplo',
  rows: [
    { label: 'Recogida', value: 'A 1 km de ti' },
    { label: 'Destino', value: 'Terminal terrestre' },
    { label: 'Distancia', value: '3 km' },
    { label: 'Tiempo', value: '8 min' },
    { label: 'Forma de pago', value: 'Efectivo' },
    { label: 'Tarifa propuesta', value: 'S/8' },
  ],
  noteTitle: 'Tú decides',
  note: 'Revisa la información y la tarifa propuesta. Puedes aceptar la solicitud o ajustar tu propuesta antes de confirmar.',
} as const;

export const driverSafety: LabeledItem[] = [
  { title: 'Una plataforma con perfiles revisados', description: 'El equipo revisa tus documentos antes de activarte, y los conductores pasan por la misma validación.' },
  { title: 'PIN que confirma el viaje correcto', description: 'Pasajero y conductor comparten la misma referencia antes de iniciar.' },
  { title: 'Conoces el viaje antes de aceptar', description: 'Recogida, destino, distancia, tiempo y forma de pago a la vista.' },
  { title: 'Soporte cuando lo necesites', description: 'Escríbenos a soporte@woki.pe.' },
];

export const driverRequirements = {
  title: 'Requisitos y registro',
  subtitle: 'Prepara estos datos para enviar tu perfil a revisión.',
  requirements: ['Licencia de conducir', 'SOAT vigente', 'Datos del vehículo', 'Celular con app Woki'],
  steps: [
    { title: 'Elige perfil', description: 'Selecciona el perfil de conductor en la app.' },
    { title: 'Envía documentos', description: 'Completa los datos y adjunta la información solicitada.' },
    { title: 'Espera validación equipo', description: 'El equipo revisa el perfil antes de activarlo.' },
  ],
} as const;

export const driverFaqs: QuestionItem[] = [
  { question: '¿Cómo me registro como conductor?', answer: 'Descarga la app, elige la opción de conductor y sube tus documentos. Nuestro equipo los revisa y te activa.' },
  { question: '¿Qué documentos necesito?', answer: 'Necesitas licencia de conducir, SOAT vigente y los datos de tu vehículo.' },
  { question: '¿Cuánto cobra Woki?', answer: 'Las condiciones aplicables se informan en la app antes de que empieces a conducir.' },
  { question: '¿Cuándo recibo mi pago?', answer: 'Las formas de pago disponibles se muestran en la app al revisar cada solicitud.' },
  { question: '¿Puedo elegir mis viajes?', answer: 'Sí. Puedes revisar la información de cada solicitud y decidir si la aceptas.' },
  { question: '¿Puedo ajustar la tarifa?', answer: 'Puedes aceptar la propuesta o elegir un ajuste entre las opciones que muestre la app.' },
  { question: '¿Puedo conectarme a cualquier hora?', answer: 'Puedes conectarte cuando quieras; no hay horarios fijos.' },
];

export const passengerFinalDestination = {
  eyebrow: 'Tu siguiente viaje',
  title: 'Cuando quieras moverte, Woki está cerca',
  text: 'Descubre cómo funciona el recorrido y revisa los detalles antes de pedir tu taxi.',
  primaryLabel: 'Ver cómo funciona',
  primaryHref: '/como-funciona',
  secondaryLabel: 'Contactar a Woki',
  secondaryHref: '/contacto',
} as const;

export const driverFinalDestination = {
  eyebrow: 'Tu próximo paso',
  title: 'Conoce Woki y prepara tu registro',
  text: 'Revisa los requisitos para conducir y contáctanos si necesitas orientación.',
  primaryLabel: 'Ver requisitos',
  primaryHref: '/conductores#registro-conductor',
  secondaryLabel: 'Contactar a Woki',
  secondaryHref: '/contacto',
} as const;

export const benefits: IconItem[] = [
  { title: 'Viajes seguros', description: 'Conductores verificados con documentos y vehículo al día.', iconPath: 'M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3zM9 12l2 2 4-4' },
  { title: 'Rápido', description: 'Solicita tu taxi en segundos y mira cuánto tarda en llegar.', iconPath: 'M13 2L4 14h7l-1 8 9-12h-7l1-8z' },
  { title: 'Confiable', description: 'Seguimiento del viaje en tiempo real, de principio a fin.', iconPath: 'M12 21s-7-6-7-11a7 7 0 0114 0c0 5-7 11-7 11zM12 10m-2 0a2 2 0 104 0 2 2 0 10-4 0' },
  { title: 'Acompañamiento', description: 'Información clara para ayudarte durante la experiencia de viaje.', iconPath: 'M4 14v-2a8 8 0 0116 0v2M4 14h3v5H4zM17 14h3v5h-3zM20 19c0 2-3 2-6 2' },
];

export const passengerSteps: JourneyStep[] = [
  { title: 'Pide tu taxi', description: 'Indica dónde estás y a dónde vas. Añade una referencia si la necesitas.' },
  { title: 'Te asignamos conductor', description: `${brand.name} conecta contigo al taxi verificado más cercano.` },
  { title: 'Comparte tu PIN y viaja', description: 'Dale el PIN al conductor para confirmar que es el viaje correcto.' },
  { title: 'Paga y califica', description: 'Paga en efectivo o con Yape y deja tu reseña del conductor.' },
];

export const driverSteps: JourneyStep[] = [
  { title: 'Conéctate', description: 'Activa “En línea” y mira las solicitudes que tienes cerca.' },
  { title: 'Revisa el viaje', description: 'Ves recogida, destino, distancia, tiempo y forma de pago.' },
  { title: 'Acepta tu tarifa', description: 'Acepta la tarifa o súmale S/1, S/2 o S/3 en un toque.' },
  { title: 'Gana más', description: 'Controla lo ganado hoy y tu porcentaje de aceptación.' },
];

export const driverBenefits: ContentItem[] = [
  { title: 'Cada viaje, claro desde el inicio', description: 'Consulta recogida, destino, distancia, tiempo y forma de pago antes de aceptar la solicitud.' },
  { title: 'Participa en tu tarifa', description: 'Acepta la propuesta o ajústala con +S/1, +S/2 o +S/3.' },
  { title: 'Tus ganancias a la vista', description: 'Revisa cuánto llevas en el día y consulta tu porcentaje de aceptación.' },
  { title: 'Conéctate a tu ritmo', description: 'Activa “En línea” cuando estés listo para recibir solicitudes cerca de ti.' },
];

export const driverReasons: IconItem[] = [
  { title: 'Movilidad local, de verdad', description: `Woki nace en ${brand.city} para acercar a quienes conocen sus calles con las personas que necesitan moverse por la ciudad.`, iconPath: 'M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M8 9h.01M12 9h.01M16 9h.01' },
  { title: 'La confianza se construye entre ambos', description: 'El PIN de seguridad confirma el inicio del viaje correcto y ayuda a que pasajero y conductor compartan la misma referencia.', iconPath: 'M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3zM9 12l2 2 4-4' },
  { title: 'Una experiencia pensada para el taxi urbano', description: 'Las herramientas de Woki acompañan el servicio desde que te conectas hasta que completas cada recorrido.', iconPath: 'M4 12h16M13 5l7 7-7 7M4 5v14' },
];

export const faqs: { question: string; answer: string }[] = [
  { question: `¿Dónde funciona ${brand.name}?`, answer: `${brand.name} está disponible en ${brand.city} y alrededores. Pronto llegaremos a más ciudades.` },
  { question: '¿Cómo sé que mi conductor es de confianza?', answer: 'Todos los conductores son verificados: licencia, SOAT y datos del vehículo. Además, cada viaje usa un PIN de seguridad y puedes ver las reseñas de otros pasajeros.' },
  { question: '¿Cómo pago mi viaje?', answer: 'Puedes pagar en efectivo o con Yape directamente al conductor.' },
  { question: '¿Puedo seguir mi viaje en tiempo real?', answer: 'Sí. Ves al conductor en el mapa, su placa, su vehículo y el tiempo de llegada. También puedes escribirle o llamarlo desde la app.' },
  { question: '¿Cómo me registro como conductor?', answer: 'Descarga la app, elige la opción de conductor y sube tus documentos. Nuestro equipo los revisa y te activa.' },
];

export const edificios: [number, number, number][] = [[0,60,70],[60,44,110],[104,70,80],[174,50,130],[224,80,95],[304,46,60],[350,70,120],[420,56,85],[476,90,140],[566,50,75],[616,74,100],[690,60,125],[750,50,70]];
export const ventanas = edificios.flatMap(([x, w, h], i) => {
  const out: { x: number; y: number; d: number }[] = [];
  for (let y = 660 - h * 1.4 + 22, r = 0; y < 648; y += 24, r++)
    for (let cx = x + 8, c = 0; cx < x + w - 7; cx += 13, c++)
      if ((i * 7 + r * 3 + c * 5) % 4 !== 0) out.push({ x: cx, y, d: ((i + r + c) % 7) * 0.6 });
  return out;
});

const casaColores = ['#0b7480', '#1f95a0', '#65d9dd', '#e9f7f8', '#2a8a94', '#f5a524'];
export const casas = Array.from({ length: 34 }, (_, i) => {
  const w = 18 + ((i * 7) % 9), h = 14 + ((i * 5) % 11);
  return { x: 290 + i * 26 + ((i * 13) % 9), w, top: 106 - h, c: casaColores[i % 9 === 4 ? 5 : i % 5] };
}).filter((c) => c.x + c.w < 650 || c.x > 790);

export type StructuredPage = 'home' | 'about' | 'contact';

export function buildJsonLd(_site?: URL, page: StructuredPage = 'home') {
  const base = new URL(brand.siteUrl);
  const organizationId = `${base.href}#organization`;
  const websiteId = `${base.href}#website`;
  const organization: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness', 'TaxiService'],
    '@id': organizationId,
    name: brand.projectName,
    url: base.href,
    logo: { '@type': 'ImageObject', url: new URL('/favicon.svg', base).href, caption: `${brand.name} logo` },
    areaServed: [
      { '@type': 'City', name: brand.city },
      { '@type': 'AdministrativeArea', name: brand.region },
      { '@type': 'Country', name: brand.country },
    ],
    address: { '@type': 'PostalAddress', addressLocality: brand.city, addressRegion: brand.region, addressCountry: 'PE' },
  };
  if (!brand.whatsappIsTemporary) organization.telephone = brand.whatsapp;
  if (!brand.emailIsTemporary) organization.email = brand.email;

  const structuredData: Record<string, unknown>[] = [
    organization,
    { '@context': 'https://schema.org', '@type': 'WebSite', '@id': websiteId, name: brand.projectName, url: base.href, inLanguage: 'es-PE', publisher: { '@id': organizationId } },
  ];

  const playUrl = import.meta.env.PUBLIC_GOOGLE_PLAY_URL?.trim();
  if (playUrl) structuredData.push({ '@context': 'https://schema.org', '@type': 'MobileApplication', name: brand.projectName, operatingSystem: 'Android', applicationCategory: 'TravelApplication', url: playUrl, downloadUrl: playUrl, isPartOf: { '@id': websiteId } });

  if (page === 'home') {
    structuredData.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(({ question, answer }) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })) });
    return structuredData;
  }

  const pagePath = page === 'about' ? '/nosotros' : '/contacto';
  const pageName = page === 'about' ? 'Nosotros' : 'Contáctanos';
  const pageUrl = new URL(pagePath, base).href;
  structuredData.push({ '@context': 'https://schema.org', '@type': page === 'about' ? 'AboutPage' : 'ContactPage', '@id': `${pageUrl}#page`, name: `${pageName} | ${brand.name}`, url: pageUrl, isPartOf: { '@id': websiteId }, mainEntity: { '@id': organizationId } });
  structuredData.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: base.href },
      { '@type': 'ListItem', position: 2, name: pageName, item: pageUrl },
    ],
  });
  return structuredData;
}

export function buildSectionJsonLd(_site: URL | undefined, path: string, name: string, description: string) {
  const base = new URL(brand.siteUrl);
  const url = new URL(path, base).href;
  return [
    { '@context': 'https://schema.org', '@type': 'WebPage', name, description, url, isPartOf: { '@id': `${base.href}#website` }, about: { '@id': `${base.href}#organization` }, inLanguage: 'es-PE' },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: base.href },
      { '@type': 'ListItem', position: 2, name, item: url },
    ] },
  ];
}

export const contacto = {
  email: brand.email,
  legalEmail: brand.legalEmail,
  emailIsTemporary: brand.emailIsTemporary,
  ubicacion: `${brand.city}, ${brand.region}, ${brand.country}`,
  whatsapp: brand.whatsapp,
  whatsappIsTemporary: brand.whatsappIsTemporary,
};

export const features: IconItem[] = [
  { title: 'PIN de seguridad', description: 'Cada viaje tiene un código único. Solo el conductor correcto puede iniciarlo.', iconPath: 'M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3zM9.5 12.5V11a2.5 2.5 0 015 0v1.5M9 12.5h6v4H9z' },
  { title: 'Seguimiento en tiempo real', description: 'Mira el recorrido en el mapa y cuánto falta para llegar.', iconPath: 'M12 21s-7-6-7-11a7 7 0 0114 0c0 5-7 11-7 11zM12 10m-2.5 0a2.5 2.5 0 105 0 2.5 2.5 0 10-5 0' },
  { title: 'Chat y llamada', description: 'Habla con tu conductor sin salir de la app.', iconPath: 'M5 5h14a2 2 0 012 2v8a2 2 0 01-2 2h-7l-5 4v-4H5a2 2 0 01-2-2V7a2 2 0 012-2z' },
  { title: 'Pago en efectivo o Yape', description: 'Elige cómo pagar antes de pedir tu taxi.', iconPath: 'M3 7a2 2 0 012-2h13v4M3 7v10a2 2 0 002 2h14a1 1 0 001-1v-8a1 1 0 00-1-1H5a2 2 0 01-2-2zM16 14h2' },
  { title: 'Reseñas reales', description: 'Consulta la calificación y los comentarios de otros pasajeros.', iconPath: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z' },
];

export const values: IconItem[] = [
  { title: 'Confianza', description: 'Conductores verificados y un PIN en cada viaje para que viajes tranquilo.', iconPath: 'M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3zM9 12l2 2 4-4' },
  { title: 'Cercanía', description: 'Conectamos a vecinos con taxistas de la ciudad, con trato cercano.', iconPath: 'M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z' },
  { title: 'Modernidad', description: 'Tecnología actual para pedir, seguir y pagar tu viaje sin complicaciones.', iconPath: 'M13 2L4 14h7l-1 8 9-12h-7l1-8z' },
  { title: 'Facilidad de uso', description: 'Una app simple: pides tu taxi en segundos, sin vueltas.', iconPath: 'M8 3h8a1 1 0 011 1v16a1 1 0 01-1 1H8a1 1 0 01-1-1V4a1 1 0 011-1zM11 18h2' },
];

export const companyPurpose = {
  introduction: `${brand.name} es una propuesta de movilidad urbana nacida para acercar a pasajeros y conductores de ${brand.city}. Queremos que cada viaje se entienda mejor desde que se solicita hasta que termina.`,
  mission: `Conectar a las personas que necesitan movilizarse con conductores locales a través de una experiencia digital clara, cercana y útil para la realidad de ${brand.city}.`,
  vision: 'Impulsar una movilidad urbana más conectada y confiable, creciendo junto a las comunidades y poniendo la tecnología al servicio de las personas.',
} as const;

export const companyPillars: IconItem[] = [
  { title: 'Escuchamos la ciudad', description: `Diseñamos Woki pensando en las necesidades cotidianas de pasajeros y conductores de ${brand.city}.`, iconPath: 'M4 5h16v11H8l-4 4V5zM8 9h8M8 12h5' },
  { title: 'Conectamos a las personas', description: 'Acercamos a pasajeros y conductores para que coordinen su viaje desde una misma plataforma.', iconPath: 'M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M10 11a4 4 0 100-8 4 4 0 000 8zM20 8v6M23 11h-6' },
  { title: 'Damos claridad al viaje', description: 'Mostramos información útil del recorrido y la tarifa antes de que el conductor acepte.', iconPath: 'M4 5h16v14H4zM8 9h8M8 13h5M16 16h.01' },
  { title: 'Acompañamos el recorrido', description: 'Integramos herramientas como el PIN y el seguimiento para ayudar a coordinar cada trayecto.', iconPath: 'M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3zM9 12l2 2 4-4' },
];

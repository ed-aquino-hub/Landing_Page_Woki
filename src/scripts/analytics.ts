// Analítica: eventos al dataLayer de GTM, solo si el usuario aceptó la analítica
// (AnalyticsConsent carga GTM y marca window.wokiGtmLoaded). En GTM se crean
// activadores de "Evento personalizado" para cta_click, store_click,
// contact_click, faq_open, contact_submit y complaint_submit, y una etiqueta de evento GA4
// que use las variables de capa de datos cta_label, cta_location y page_path.
// Nunca se envían datos personales (nombres, correos, documentos ni textos del usuario).
export type TrackPayload = Record<string, string | number | undefined>;

const analyticsWindow = window as Window & { dataLayer?: TrackPayload[]; wokiGtmLoaded?: boolean };

export const track = (event: string, payload: TrackPayload) => {
  if (!analyticsWindow.wokiGtmLoaded) return;
  analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
  analyticsWindow.dataLayer.push({ event, page_path: location.pathname, ...payload });
};

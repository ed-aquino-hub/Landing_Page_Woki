import images from './images';
import { getSiteConfig } from './site-config.mjs';

const runtimeEnv = typeof process === 'undefined' ? {} : process.env;
const siteConfig = getSiteConfig({ ...import.meta.env, ...runtimeEnv });

export const brand = {
  name: 'Woki',
  projectName: 'Woki App',
  city: 'Cerro de Pasco',
  region: 'Pasco',
  country: 'Perú',
  email: 'soporte@woki.pe',
  legalEmail: 'legal@woki.pe',
  emailIsTemporary: false,
  whatsapp: '+51 900 000 000',
  whatsappIsTemporary: true,
  siteUrl: siteConfig.siteUrl,
  noIndex: siteConfig.isNoIndex,
  themeColor: '#218e97',
  demoPin: '4827',
  legalUpdated: '17 de noviembre de 2026',
  defaultTitle: 'Pide un taxi en Cerro de Pasco | Woki',
  defaultDescription: 'Pide tu taxi en Cerro de Pasco con Woki: conoce tu tarifa, sigue el viaje y comparte un PIN de seguridad. Descubre una forma más fácil de moverte.',
} as const;

export const analytics = {
  gtmContainerId: 'GTM-P487G36D',
} as const;

export const routes = {
  home: '/#inicio',
  howItWorks: '/como-funciona',
  safety: '/seguridad',
  drivers: '/conductores',
  legalNotice: '/aviso-legal',
  download: '/#descargar',
  help: '/#ayuda',
  about: '/nosotros',
  contact: '/contacto',
  accountDeletion: '/eliminar-cuenta',
  terms: '/terminos',
  driverTerms: '/terminos-conductor',
  privacy: '/privacidad',
  cookies: '/cookies',
  complaints: '/libro-de-reclamaciones',
} as const;

/** Nombre de cada página en la ruta de navegación visible y en el JSON-LD BreadcrumbList. */
export const breadcrumbLabels = {
  home: 'Inicio',
  safety: 'Pasajeros',
  howItWorks: 'Cómo funciona',
  drivers: 'Conductores',
  about: 'Nosotros',
  contact: 'Contacto',
  complaints: 'Libro de Reclamaciones',
} as const;

export const assets = {
  socialImage: images.driver.src,
  driverPhoto: images.driver.src,
  aboutBanner: images.aboutBanner.src,
  contactBanner: images.contactBanner.src,
} as const;

export const headerActions = {
  download: { href: routes.download, label: 'Descargar app' },
} as const;

export const footerNavigation = [
  { href: routes.home, label: 'Inicio' },
  { href: routes.howItWorks, label: 'Cómo funciona' },
  { href: routes.safety, label: 'Pasajeros' },
  { href: routes.drivers, label: 'Conductores' },
  { href: routes.about, label: 'Nosotros' },
  { href: routes.contact, label: 'Contáctanos' },
] as const;

export const legalNavigation = [
  { href: routes.legalNotice, label: 'Información del sitio' },
  { href: routes.terms, label: 'Términos del pasajero' },
  { href: routes.driverTerms, label: 'Términos del conductor' },
  { href: routes.privacy, label: 'Política de privacidad' },
  { href: routes.cookies, label: 'Política de cookies' },
  { href: routes.accountDeletion, label: 'Eliminar cuenta' },
] as const;


import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import { getSiteConfig } from './src/data/site-config.mjs';

export default defineConfig(({ mode }) => {
  const fileEnv = loadEnv(mode, process.cwd(), '');
  const siteConfig = getSiteConfig({ ...fileEnv, ...process.env });
  return {
    site: siteConfig.siteUrl,
    trailingSlash: 'never',
    redirects: {
      '/aviso-legal': { destination: '/Informacion-Legal/Informacion-del-sitio', permanent: true },
      '/terminos': { destination: '/Informacion-Legal/Terminos-y-Condiciones-Pasajero', permanent: true },
      '/terminos-conductor': { destination: '/Informacion-Legal/Terminos-Condiciones-Conductor', permanent: true },
      '/privacidad': { destination: '/Informacion-Legal/privacidad', permanent: true },
      '/cookies': { destination: '/Informacion-Legal/cookies', permanent: true },
    },
    vite: { envPrefix: ['PUBLIC_', 'VERCEL_'] },
  };
});

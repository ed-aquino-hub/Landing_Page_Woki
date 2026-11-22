import driver from '../assets/images/conductor.jpg';
import aboutBanner from '../assets/images/woki-nosotros.jpg';
import contactBanner from '../assets/images/woki-contacto.jpg';

const image = (src: typeof driver, path: string, alt: string, purpose: string) => ({ src, path, alt, purpose });

const images = {
  driver: image(driver, 'src/assets/images/conductor.jpg', 'Conductor de taxi dentro de un vehículo en Cerro de Pasco.', 'Foto principal de conductores y base provisional de las vistas al compartir.'),
  aboutBanner: image(aboutBanner, 'src/assets/images/woki-nosotros.jpg', 'Imagen provisional del equipo y la propuesta local de Woki.', 'Imagen al compartir la página de Nosotros.'),
  contactBanner: image(contactBanner, 'src/assets/images/woki-contacto.jpg', 'Imagen provisional para el banner de contacto de Woki.', 'Imagen al compartir la página de Contacto.'),
} as const;

export default images;

import { brand, routes } from './site';
import { driverRequirements } from './content';

/** Contenido de la página de inicio (propuesta A · "Confianza en ruta"). */

export const homeHero = {
  eyebrow: `Ahora en ${brand.city}`,
  titleLead: 'Tu taxi seguro,',
  titleAccent: 'de puerta a puerta.',
  lead: 'Pide en segundos, verifica a tu conductor antes de subir y confirma tu viaje con un PIN único. Así de simple, así de seguro.',
  driverLink: { href: routes.drivers, label: '¿Tienes taxi? Gana manejando con Woki' },
  trust: [
    { label: 'Conductores verificados', iconPath: 'M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3zM9 12l2 2 4-4' },
    { label: 'PIN en cada viaje', iconPath: 'M7 11V8a5 5 0 0110 0v3M6 11h12v9H6z' },
    { label: 'Efectivo o Yape', iconPath: 'M3 7h18v11H3zM16 12.5h2' },
  ],
} as const;

export const homeDemoTrip = {
  status: 'En camino',
  eta: 'Llega en 1 min',
  driver: { initials: 'JQ', name: 'Jorge Quispe', rating: '4.9', car: 'Toyota Yaris · Blanco', plate: 'PAS-482' },
  fare: 'S/ 6.00',
} as const;

export const audienceCards = [
  {
    id: 'pasajeros',
    eyebrow: 'Para pasajeros',
    title: 'Llega tranquilo a donde vayas',
    description: 'Tarifa clara, conductor verificado y tu viaje siempre a la vista.',
    cta: { href: routes.safety, label: 'Conoce cómo te cuidamos', track: 'audiencia_pasajero' },
    tone: 'light',
    iconPath: 'M12 3.8a3.2 3.2 0 100 6.4 3.2 3.2 0 000-6.4zM5.5 20v-1.8a6.5 6.5 0 0113 0V20',
  },
  {
    id: 'conductores',
    eyebrow: 'Para conductores',
    title: 'Maneja a tu ritmo, paga como te convenga',
    description: 'Sin horarios fijos. Elige entre 15 % por viaje o un plan mensual de S/ 50.',
    cta: { href: routes.drivers, label: 'Quiero ser conductor', track: 'audiencia_conductor' },
    tone: 'dark',
    iconPath: 'M4 15l1.5-5h13L20 15v4h-2v-2H6v2H4zM6 10l1.3-3h9.4l1.3 3',
  },
] as const;

export type SafetyVisual = 'plate' | 'pin' | 'route' | 'stars';

export const safetyStages: { step: string; title: string; description: string; visual: SafetyVisual }[] = [
  { step: 'Antes de subir', title: 'Compara conductor y placa', description: 'Ves nombre, vehículo y placa. Si algo no coincide, no subas.', visual: 'plate' },
  { step: 'Al subir', title: 'Confirma con tu PIN', description: 'Un código único por viaje. Solo el conductor correcto puede iniciarlo.', visual: 'pin' },
  { step: 'Durante el viaje', title: 'Sigue la ruta en vivo', description: 'Mapa en tiempo real, chat y llamada sin salir de la app.', visual: 'route' },
  { step: 'Al llegar', title: 'Califica y ayuda a otros', description: 'Tu reseña mantiene la calidad del servicio para toda la ciudad.', visual: 'stars' },
];

export const rideSteps = [
  { title: 'Dices a dónde vas', description: 'Origen, destino y una referencia local, como “frente al grifo, puerta azul”.' },
  { title: 'Ves la tarifa antes', description: 'Sabes cuánto pagarás antes de confirmar. Sin sorpresas al llegar.' },
  { title: 'Un conductor acepta', description: 'Recibes sus datos, la placa y el tiempo de llegada al instante.' },
  { title: 'Llegas y pagas fácil', description: 'En efectivo o con Yape, directo al conductor. Luego calificas.' },
] as const;

export const driverPlans = [
  { name: 'Comisión por viaje', price: '15 %', description: 'Pagas solo por viaje completado. Ideal si conduces de vez en cuando.', featured: false, badge: '' },
  { name: 'Plan mensual', price: 'S/ 50', description: 'Cuota fija al cierre de mes. Lo demás es tuyo.', featured: true, badge: 'Si manejas a diario' },
] as const;

export const driverPerks = [
  'Sin horarios fijos',
  'Tarifa visible antes de aceptar',
  'Cobro directo: efectivo o Yape',
  'Solicitudes cerca de ti',
] as const;

export const driverRequirementsSummary = driverRequirements.requirements.join(', ');

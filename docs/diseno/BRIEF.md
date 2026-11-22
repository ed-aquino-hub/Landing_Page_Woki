# Rediseño del sitio Woki: brief de implementación

Este documento y los `.html` de esta carpeta son las propuestas visuales aprobadas, exportadas del lienzo de Claude Design.
Son **mockups estáticos de referencia**: copia la estructura, el contenido y la jerarquía visual, no el HTML con estilos en línea.

## Estado

- **Hecho:** la página de inicio (`src/pages/index.astro` + `src/components/home/*` + `src/styles/home.css`) y el header nuevo ya están implementados en la rama `rediseno-inicio`.
  Son la **referencia de cómo implementar**: componentes por sección, datos en `src/data/*`, clases con prefijo propio y reutilización de animaciones.
- **Pendiente (este encargo):** implementar las propuestas del resto de páginas.

| Página | Archivo actual | Propuesta |
|---|---|---|
| Seguridad (pasajeros) | `src/pages/seguridad.astro` | `Seguridad.html` |
| Conductores | `src/pages/conductores.astro` | `Conductores.html` + `ConductoresMovil.html` (móvil) |
| Cómo funciona | `src/pages/como-funciona.astro` | `ComoFunciona.html` |
| Nosotros | `src/pages/nosotros.astro` | `Nosotros.html` |
| Contacto | `src/pages/contacto.astro` + `src/components/Contact.astro` | `Contacto.html` |
| Legales (aviso-legal, terminos, terminos-conductor, privacidad, cookies, eliminar-cuenta) | `src/layouts/Legal.astro` | `Legal.html` (una plantilla para todas) |

`Main.html` y `Movil.html` son la propuesta del inicio, ya implementada; sirven como referencia del lenguaje visual.

## Marca (manual de marca Woki)

- Atributos: confianza, cercanía, modernidad y facilidad de uso.
- Colores: cian primario `#218e97`, profundo `#005b66`, aqua `#65d9dd`, bruma `#73b6bd`, blanco. Tinta oscura usada en el sitio: `#0a2a2e`. Fondo suave: `#eef7f7`.
- Tipografía: Open Sans (ya cargada como `Open Sans Variable` en `global.css`).
- Contraste: el blanco sobre `#218e97` da ~3.9:1, así que solo se usa con texto grande. Botones y texto pequeño van en `#005b66`.
- Tokens existentes en `:root` de `src/styles/global.css`: `--cian`, `--deep`, `--aqua`, `--mist`, `--paper`, `--ink`. Reutilízalos.

## Reglas de implementación

1. **Rama:** trabaja en una rama nueva creada desde `rediseno-inicio` (por ejemplo `rediseno-paginas`) y abre un PR hacia `rediseno-inicio`. No toques `main`.
2. **Commits:** en español natural, con prefijos (`feat:`, `fix:`, `refactor:`…) y **sin línea Co-Authored-By**.
3. **Componentes:** un componente por sección, en `src/components/<pagina>/` o reutilizables en `src/components/`. Los textos viven en `src/data/` (`content.ts` / nuevos archivos), no hardcodeados en el markup.
   - Los componentes viejos (`AudienceHero`, `StopsList`, `JourneyRoute`, `FaqList`, `FinalDestination`, `RequirementsSteps`, `SectionJump`, etc.) pueden reemplazarse.
   - Elimina los que queden sin uso.
4. **Estilos:** CSS por página o compartido (p. ej. `src/styles/pages.css`), con clases con prefijo para no chocar con `global.css`. Cuidado con la especificidad: `section{padding}` global se pisa con una clase, no con `.x section`.
5. **No inventes datos:** usa solo el contenido real de `src/data/content.ts` y `site.ts`. Sin estadísticas inventadas.
   - Planes reales: 15 % por viaje o S/ 50 al mes.
   - Pagos: efectivo / Yape / billetera digital.
   - Requisitos: licencia, DNI, SOAT, inspección técnica y tarjeta de propiedad.
6. **Tiendas:** usa `StoreButtons` (Google Play; muestra "Próximamente" si no hay `PUBLIC_GOOGLE_PLAY_URL`). No agregues App Store.
7. **Foto:** solo existe `src/assets/images/conductor.jpg` (las de `pasos/` son copias). Úsala con `<Picture>` (avif/webp, `alt` descriptivo). En Nosotros deja el bloque gráfico de ciudad: reutiliza el mapa SVG de Perú que ya existe en `nosotros.astro`.
8. **Formulario de contacto:** conserva toda la lógica de `main.ts` (validación, endpoint opcional, mailto) y sus `data-*`. Puedes añadir el selector de tema (Pasajero / Conductor / Otro) si incluyes el valor en el mailto/endpoint.

## Animaciones y carga (reutilizar)

- `[data-reveal]` con `style="--i:n"` para aparición escalonada.
- `data-count` / `data-dec` para contadores y `data-slot` para el PIN tipo tragamonedas (en `main.ts`).
- Keyframes en `global.css`: `rise`, `float`, `bobY`, `ping`, `shine`, `dash`, `drive`, `routeflow`. También `.road` + `<Taxi />`.
- Respeta `prefers-reduced-motion`.
- El splash solo aparece en el inicio (`<Layout splash>`); las subpáginas usan `<Header solid />`.

## SEO (obligatorio)

- `npm run check:seo` debe pasar sin errores en todas las páginas. Hoy falla en:
  - `aviso-legal`: meta description de 158 caracteres; el rango es 120–155.
  - `/como-funciona`: la imagen principal necesita `fetchpriority="high"`, o no tener imagen principal.
  - `/conductores` y `/seguridad`: el contenido principal debe tener 300–500 palabras. Las propuestas ya son más concisas.
  - Formulario: sin endpoint debe explicar que no está disponible y desactivar el envío. Revisa qué exige exactamente `scripts/check-seo.mjs` y cúmplelo.
- Exactamente un `<h1>` por página y jerarquía h2/h3 correcta. Cada `<section>` lleva `aria-labelledby` hacia su título.
- Ruta de navegación visible (Inicio / Página), consistente con el JSON-LD `BreadcrumbList` que ya generan `buildSectionJsonLd` / `Legal.astro`.
- Las FAQ visibles deben salir de la misma fuente que su JSON-LD `FAQPage` (`passengerFaqs`, `driverFaqs`).
- Conserva `title`, `description`, `canonical`, OG y JSON-LD existentes en cada página.
- Enlaces internos entre páginas (Seguridad ↔ Cómo funciona ↔ Conductores ↔ Contacto).

## Google Analytics (obligatorio)

GTM se carga solo con consentimiento (`AnalyticsConsent.astro`). `main.ts` ya envía eventos al `dataLayer` (solo si `window.wokiGtmLoaded`) a partir de atributos:

```html
<a href="..." data-track="cta_click" data-track-label="registro_conductor" data-track-location="conductores_hero">…</a>
```

- Eventos existentes: `cta_click`, `store_click` (lo pone `StoreButtons` con `location`), `contact_click` (mailto) y `faq_open` (`<details data-faq="pregunta">`).
- Añade `data-track*` a todos los CTA, enlaces mailto y `<details>` de FAQ de las páginas nuevas, con `label` en snake_case y `location` = `<pagina>_<seccion>`.
- Para el formulario de contacto, envía un evento `contact_submit` (con `cta_label` = tema) al pasar la validación. Hazlo con el mismo helper `track` de `main.ts`.

## Verificación antes de terminar

- `npm run check` sin errores.
- `npm run build` y `npm run check:seo` sin errores.
- Revisa que no haya scroll horizontal a 390 px y que el header nuevo marque la página actual.

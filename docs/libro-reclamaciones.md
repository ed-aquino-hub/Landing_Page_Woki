# Libro de Reclamaciones virtual

La página `/libro-de-reclamaciones` ya está lista en el sitio. Falta conectar un **Cloudflare Worker** que reciba la hoja, le asigne su número y envíe los correos.

| Pieza | Archivo |
|---|---|
| Página | `src/pages/libro-de-reclamaciones.astro` |
| Formulario | `src/components/reclamaciones/ComplaintForm.astro` |
| Lógica del navegador | `src/scripts/reclamaciones.ts` (validación, envío, constancia y evento GA) |
| Textos y titular | `src/data/reclamaciones.ts` |
| Estilos | `src/styles/reclamaciones.css` |
| Enlace | footer de todas las páginas, botón "Libro de Reclamaciones" |

## Antes de publicar (pendientes)

1. **Titular (persona natural).** Completa `complaintsProvider` en `src/data/reclamaciones.ts`: nombre, RUC (10…), domicilio. Luego cambia `pending` a `false`.
   Mientras `pending` sea `true`, la página muestra el aviso "Datos del titular pendientes".
2. **Worker desplegado** y su URL en `PUBLIC_COMPLAINTS_ENDPOINT`: en `.env`, en los argumentos de build de Docker (`compose.yaml`) o en Vercel.
   Sin esa variable, el botón de envío sale desactivado y la página remite a `soporte@woki.pe` (`npm run check:seo` lo verifica).
3. **Revisión legal.** Valida los campos y textos con el reglamento vigente del Libro de Reclamaciones (Indecopi) o con un abogado, en especial:
   - el plazo y la forma de conservación
   - la obligación de enviar la copia por correo
   - los avisos obligatorios
4. **Política de privacidad.** Añade el tratamiento de datos del libro: finalidad, conservación y el proveedor de correo que use el Worker.

## Contrato con el Worker

### Petición

`POST {PUBLIC_COMPLAINTS_ENDPOINT}` con `Content-Type: application/json`:

```json
{
  "tipo": "reclamo",
  "consumidor": {
    "nombre": "Ana Pérez Quispe",
    "tipoDocumento": "DNI",
    "numeroDocumento": "12345678",
    "domicilio": "Jr. Ejemplo 123, Chaupimarca, Pasco",
    "telefono": "987654321",
    "correo": "ana@correo.com",
    "esMenor": false,
    "apoderado": null
  },
  "servicio": {
    "tipo": "Viaje como pasajero",
    "fecha": "2026-11-20",
    "monto": 6.5,
    "descripcion": "Viaje de Plaza Chaupimarca al hospital"
  },
  "detalle": "…",
  "pedido": "…",
  "aceptaDeclaracion": true,
  "fechaRegistroCliente": "2026-11-23T15:04:05.000Z",
  "website": ""
}
```

Valores y reglas:
- `tipo`: `"reclamo"` o `"queja"`.
- `tipoDocumento`: `"DNI"`, `"Carné de extranjería"` o `"Pasaporte"`.
- `apoderado`: `{ "nombre", "documento" }` cuando `esMenor` es `true`; si no, `null`.
- `servicio.fecha` y `servicio.monto` pueden ser `null`.
- `website` es un honeypot: si llega con texto, descarta la petición sin error visible.
- El tipo TypeScript `ComplaintPayload` está en `src/scripts/reclamaciones.ts`.

### Respuesta

- **Éxito (HTTP 200):**
  ```json
  { "ok": true, "numero": "WOKI-2026-000123", "fecha": "2026-11-23T15:04:07.000Z" }
  ```
- **Error (HTTP 4xx/5xx):**
  ```json
  { "ok": false, "message": "Descripción para registros" }
  ```

El navegador muestra la constancia (número, fecha, tipo y correo) solo si llega `ok: true` con un `numero`. En cualquier otro caso muestra un mensaje genérico y deja reintentar.

### Lo que debe hacer el Worker

1. **CORS:** permite `POST` y `OPTIONS` solo desde el dominio del sitio (`https://www.woki.pe`, `https://woki.pe` y los previews que uses).
2. **Validar en servidor** lo mismo que valida el navegador: campos obligatorios, formato de correo y documento, y largos máximos (`detalle` 3000, `pedido` 1500).
3. **Antispam:**
   - honeypot `website`
   - límite de envíos por IP con Cloudflare Rate Limiting
   - opcionalmente Cloudflare Turnstile; si lo agregas, añade el widget al formulario y envía el token en el JSON
4. **Número correlativo** único y consecutivo, por ejemplo `WOKI-AAAA-NNNNNN`. Usa un contador atómico (un Durable Object, o D1 dentro de una transacción). KV no es atómico.
5. **Fecha oficial** del registro asignada por el servidor, en hora de Perú (UTC−5).
6. **Guardar la hoja completa**, por ejemplo en D1, como evidencia del reclamo, de su respuesta y de los plazos.
7. **Enviar dos correos**, por ejemplo con Resend:
   - a `soporte@woki.pe`, con la hoja completa y el plazo de respuesta (15 días hábiles desde la fecha de registro);
   - al consumidor, con la copia de su hoja: número, fecha, datos del proveedor y del consumidor, servicio, tipo, detalle y pedido.
8. **Responder** con `{ ok, numero, fecha }`.

Secretos del Worker, nunca en el sitio: la API key del proveedor de correo y, si se usa, la clave secreta de Turnstile.

## Analítica

Al registrarse la hoja, el sitio envía `complaint_submit` al `dataLayer`:
- `cta_label`: `reclamo` o `queja`
- `cta_location`: `libro_reclamaciones`

Se envía solo con consentimiento de analítica y **sin datos personales**.
En GTM crea el activador de evento personalizado `complaint_submit`, igual que para los demás eventos.

El enlace del footer envía `cta_click` con `libro_reclamaciones` / `footer`.

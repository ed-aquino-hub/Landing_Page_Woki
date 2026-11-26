FROM node:22-alpine AS build

WORKDIR /app
ENV ASTRO_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .

ARG PUBLIC_SITE_URL=https://www.woki.pe
ARG PUBLIC_NOINDEX=false
ARG PUBLIC_GOOGLE_SITE_VERIFICATION=
ARG PUBLIC_GOOGLE_PLAY_URL=
ARG PUBLIC_TURNSTILE_SITE_KEY=
ARG PUBLIC_COMPLAINTS_ENDPOINT=

ENV PUBLIC_SITE_URL=${PUBLIC_SITE_URL} \
    PUBLIC_NOINDEX=${PUBLIC_NOINDEX} \
    PUBLIC_GOOGLE_SITE_VERIFICATION=${PUBLIC_GOOGLE_SITE_VERIFICATION} \
    PUBLIC_GOOGLE_PLAY_URL=${PUBLIC_GOOGLE_PLAY_URL} \
    PUBLIC_TURNSTILE_SITE_KEY=${PUBLIC_TURNSTILE_SITE_KEY} \
    PUBLIC_COMPLAINTS_ENDPOINT=${PUBLIC_COMPLAINTS_ENDPOINT}

RUN npm run check && npm run build

FROM node:22-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production PORT=8080
COPY --from=build --chown=node:node /app/dist ./dist
COPY --chown=node:node server.mjs ./server.mjs

USER node
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:8080/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.mjs"]

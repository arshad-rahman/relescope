# syntax=docker/dockerfile:1

FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

ARG VITE_API_URL=http://localhost:8000/api

ENV VITE_API_URL=${VITE_API_URL}

RUN test -n "${VITE_API_URL}" \
    && npm run build


FROM nginx:alpine AS runtime

LABEL org.opencontainers.image.title="Relescope Frontend"
LABEL org.opencontainers.image.description="React frontend for Relescope"
LABEL org.opencontainers.image.source="https://github.com/arshad-rahman/relescope"

COPY nginx.conf /etc/nginx/nginx.conf

COPY \
  --from=build \
  --chown=nginx:nginx \
  /app/dist \
  /usr/share/nginx/html

RUN mkdir -p \
      /tmp/nginx/client_temp \
      /tmp/nginx/proxy_temp \
      /tmp/nginx/fastcgi_temp \
      /tmp/nginx/uwsgi_temp \
      /tmp/nginx/scgi_temp \
    && chown -R \
      nginx:nginx \
      /tmp/nginx \
      /usr/share/nginx/html \
      /etc/nginx/nginx.conf

USER nginx

EXPOSE 8080

HEALTHCHECK \
  --interval=30s \
  --timeout=5s \
  --start-period=10s \
  --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1

ENTRYPOINT []

CMD ["nginx", "-g", "daemon off;"]

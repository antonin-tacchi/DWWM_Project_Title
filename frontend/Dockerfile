# ── Stage 1 : build ──────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copie package.json en premier → npm ci en cache si package.json ne change pas
COPY package.json package-lock.json ./
RUN npm ci --prefer-offline --no-audit --no-fund

# Copie le reste du code source
COPY . .
RUN npm run build

# ── Stage 2 : runtime (Nginx) ─────────────────────────────────────
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]

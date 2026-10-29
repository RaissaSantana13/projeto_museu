# ------------------------------------
# 1. Estágio de Dependências
# ------------------------------------
FROM node:20-alpine AS deps

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

# ------------------------------------
# 2. Estágio de Build
# ------------------------------------
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# Gera a saída "standalone" (configurado em next.config.ts)
RUN npm run build

# ------------------------------------
# 3. Estágio Final de Execução (Leve e Seguro)
# ------------------------------------
FROM node:20-alpine AS runner

WORKDIR /usr/src/app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=6001

# Usuário não-root por segurança
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs
USER nextjs

# O build "standalone" já inclui um server.js mínimo com só os
# node_modules necessários — não precisamos copiar o node_modules inteiro.
COPY --chown=nextjs:nodejs --from=builder /usr/src/app/public ./public
COPY --chown=nextjs:nodejs --from=builder /usr/src/app/.next/standalone ./
COPY --chown=nextjs:nodejs --from=builder /usr/src/app/.next/static ./.next/static

EXPOSE 6001

CMD ["node", "server.js"]

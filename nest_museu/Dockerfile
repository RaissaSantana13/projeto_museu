# ------------------------------------
# 1. Estágio de Dependências e Build
# ------------------------------------
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copia manifestos de dependência
COPY package*.json ./

# Instala todas as dependências (inclusive devDependencies para o build)
RUN npm ci

# Copia todo o código-fonte
COPY . .

# Compila a aplicação NestJS
RUN npm run build

# Limpa devDependencies mantendo apenas o necessário para produção
RUN npm prune --production

# ------------------------------------
# 2. Estágio Final de Execução (Leve e Seguro)
# ------------------------------------
FROM node:20-alpine AS runner

WORKDIR /usr/src/app
ENV NODE_ENV=production

# Usuário não-root por segurança
USER node

# Copia apenas os módulos de produção e o build compilado
COPY --chown=node:node --from=builder /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=builder /usr/src/app/dist ./dist
COPY --chown=node:node package*.json ./

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
# ================================
# ETAPA 1: BUILD
# ================================

# Aquí sí hacen falta las devDependencies: esbuild es quien compila el bundle
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

# Deja el bundle en /app/dist, con canvas-confetti ya incorporado dentro
RUN npm run build

# ================================
# ETAPA 2: RUNTIME
# ================================

FROM node:22-alpine AS runner

ENV NODE_ENV=production

WORKDIR /app

# Solo el resultado de la compilación. Ni código fuente, ni node_modules, ni esbuild:
# esta imagen no sabe compilar nada, únicamente ejecutar el bundle
COPY --from=builder /app/dist ./dist

# El bundle conserva un `import` de node:http, así que es ESM. Node 22.7+ lo detecta solo
# al no encontrar package.json, pero esa heurística no es un contrato: si mañana la imagen
# base baja de versión, el arranque falla con "Cannot use import statement outside a module".
# Declararlo dentro de dist/ lo hace explícito y deja /app con dist/ como único contenido
RUN printf '{"type":"module"}' > dist/package.json

EXPOSE 3000

USER node

CMD ["node", "dist/server.js"]

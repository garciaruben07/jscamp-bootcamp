FROM node:22-alpine

WORKDIR /app

# Los manifiestos van antes que el código, y en su propia capa, para aprovechar la caché:
# mientras no cambien las dependencias, Docker reutiliza el npm ci en cada build
COPY package.json package-lock.json ./

# npm ci en lugar de npm install: instala exactamente lo que fija el lockfile
RUN npm ci

# El código va después porque cambia en cada commit. Si estuviera antes, cualquier retoque
# en server.js invalidaría la capa de dependencias y reinstalaría todo
COPY . .

# EXPOSE no publica nada por sí solo, documenta en qué puerto escucha la app
EXPOSE 3000

# La imagen de Node trae un usuario `node` sin privilegios. Correr como root dentro del
# contenedor es un riesgo innecesario para una app que solo necesita leer sus archivos
USER node

CMD ["node", "server.js"]

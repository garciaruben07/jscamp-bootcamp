FROM node:22-alpine

WORKDIR /app

COPY server.js .

EXPOSE 3000

# --watch reinicia el proceso cuando cambia un archivo. Combinado con un bind mount, editar
# server.js en el editor del host recarga el servidor dentro del contenedor sin reconstruir.
# Es una configuración de desarrollo: en producción no se monta el código desde fuera
CMD ["node", "--watch", "server.js"]

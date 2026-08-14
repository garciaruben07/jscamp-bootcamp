# "En mi máquina funciona": app.js usa structuredClone (Node 17+) y findLast (Node 18+),
# así que el mismo código funciona o revienta según la imagen base que se elija.
#
# La versión va en un ARG para poder reproducir los dos casos sin editar este archivo:
#   docker build -t por-que-node22 .                          -> ✅ ¡Todo funcionó!
#   docker build --build-arg NODE_VERSION=16 -t por-que-node16 .  -> ReferenceError
ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-alpine

WORKDIR /app

COPY app.js .

CMD ["node", "app.js"]

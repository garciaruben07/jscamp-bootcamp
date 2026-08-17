# La imagen más pequeña posible: Alpine pesa unos pocos megas y no lleva runtime de nada.
#
# El mensaje empezó siendo "Hola Docker" y luego pasó a este otro. Como el cambio solo toca
# el CMD, que es la última capa, el FROM sale como CACHED en la segunda construcción.
#
# El enunciado pedía la imagen "alpine" a secas, pero sin tag se resuelve como :latest y la
# base cambia sola con el tiempo. Fijarlo es lo que hace reproducible la construcción
FROM alpine:3.20

CMD ["echo", "Hola desde mi primera imagen"]

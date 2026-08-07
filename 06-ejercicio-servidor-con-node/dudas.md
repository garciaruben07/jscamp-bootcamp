<!-- Aquí puedes introducir tus dudas sobre el ejercicio, la consigna, la corrección, etc -->

## El ejercicio no arranca porque falta el .env

Al ejecutar `node server.js` tal cual me saltaba un error de que no encuentra el fichero `.env`,
porque `process.loadEnvFile()` falla si no existe. He creado uno con `PORT=3000` y ya arranca, pero
no sé si el fichero tenía que venir con el ejercicio y se perdió, o si lo teníamos que crear
nosotros. Lo he subido al repo para que os funcione al clonarlo.

**Respuesta:** Lo tenias que crear tu, de igual manera, siempre es importante agregar un fallback. En este caso, lo mejor es agregar un try/catch para evitar el error y agregar un puerto por defecto. En el código te dejé la implementación.

## Qué devolver cuando el método no es el correcto

Con mi manejador de rutas, algo como `DELETE /users` acaba respondiendo 404 igual que una ruta que
no existe. He leído que para eso está el 405, pero como el enunciado solo habla de rutas no
encontradas lo he dejado en 404. ¿Está bien así?

**Respuesta:** Buena pregunta, hay un matiz diferencial aquí.

404 se usa cuando la ruta directamente no existe.
405 se usa cuando la ruta existe pero no tiene el método correcto.

Lo que dices está perfecto, para este caso en donde `/users` existe pero no tiene el método `DELETE`, lo mejor es devolver 405. En caso de que no coincida con la ruta, lo mejor es devolver 404. Para implementar esto en nuestro código hay que hacer algunos cambios para poder validarlo fácilmente.

## Validar el body del POST

El enunciado no dice qué hacer si el body viene mal, así que he añadido comprobaciones de que `name`
y `age` existan y sean del tipo correcto, y devuelvo un 400 si no. Lo hice porque si no, se creaban
usuarios con campos `undefined` que luego rompían el filtro por nombre. ¿Era necesario o os
esperabais solo el camino feliz?

**Respuesta:** Muy bien! Lo que hiciste ha estado genial.
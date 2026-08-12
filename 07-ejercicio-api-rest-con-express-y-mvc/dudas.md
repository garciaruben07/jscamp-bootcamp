<!-- Aquí puedes introducir tus dudas sobre el ejercicio, la consigna, la corrección, etc -->

## Los cambios se pierden al reiniciar

Como el modelo trabaja sobre el array que sale del import de `jobs.json`, todo lo que creo, edito o
borro vive solo en memoria y al reiniciar el servidor vuelve a haber 34 empleos. En el enunciado
pone "elimina un job del array", así que entiendo que era la idea, pero al principio dudé porque
también decía que el modelo manipula el archivo. ¿Había que escribir en el JSON con `writeFile`?

**Respuesta:** Hola! Muy bien planteada la duda. No hace falta `writeFile`, la idea es poder hacer las modificaciones en dev mode para que, al reiniciar, podamos tener nuevamente el estado inicial de los empleos. Lo hiciste muy bien.

## El filtro por level no aparece en los query params

En la lista de query params del primer ejercicio están `title`, `text`, `technology`, `limit` y
`offset`, pero la firma del modelo que ponéis incluye también `level`. Lo he implementado porque
estaba en la firma, filtrando por `data.nivel`. ¿Correcto?

**Respuesta:** Muy bien! Exactamente, lo hiciste correcto.

## El puerto del código base y el de config no coinciden

El `app.js` de partida tenía el puerto 3000 y el `config.js` que pedís crear dice 1234, que además
es el que usan los ejemplos de curl. He hecho que `app.js` coja el valor de `config.js` y he quitado
la constante, entiendo que era eso lo que buscabais.

**Respuesta:** Si! Viendo el código, era exactamente lo que queríamos.
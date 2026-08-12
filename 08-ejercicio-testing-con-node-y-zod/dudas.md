<!-- Aquí puedes introducir tus dudas sobre el ejercicio, la consigna, la corrección, etc -->

## Creo que el filtro por texto del modelo está roto

Mientras escribía los tests me puse a mirar el modelo y en `getAll` hay esto:

```js
const normalizeTech = () => text.toLowerCase()
const matchText = text ? job.titulo.toLowerCase().includes(normalizeTech) : true
```

`normalizeTech` es una función y se le pasa a `includes` sin llamarla, así que nunca coincide con
nada. Lo he comprobado y buscar "developer" devuelve 0 resultados cuando en el JSON hay 7. Como
entre los tests que pedís no hay ninguno del filtro por texto, no salta.

No lo he tocado porque entendía que la tarea era escribir los tests y el schema, no arreglar el
código. ¿Lo dejo así o queríais que lo arregláramos?

## npm test se quedaba colgado

Al ejecutar `npm test` los tests pasaban pero el proceso no terminaba nunca. Es porque `app.js`
levanta el servidor salvo que exista `process.env.NODE_ENV`, y al no definirla se quedaba un
servidor abierto en el puerto 5432. Lo he resuelto poniendo `NODE_ENV=test` en el script de test
del package.json, que entiendo que es para lo que está esa condición. ¿Era esa la idea?

## Tests que se pisan entre ellos

El enunciado sugiere el mismo id para el test de PATCH y el de DELETE, pero si el DELETE se
ejecuta primero el PATCH recibe un 404. Como también decís que los tests no deben depender del
orden, he hecho que los de PUT, PATCH y DELETE creen antes su propio job y trabajen sobre ese. Los
ids del JSON los uso solo en los tests que leen. ¿Bien así?

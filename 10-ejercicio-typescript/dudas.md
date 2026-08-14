<!-- Aquí puedes introducir tus dudas sobre el ejercicio, la consigna, la corrección, etc -->

## Los datos usan tecnologías que no están en el tipo Technology

Al tipar los arrays del tercer ejercicio me saltaron tres errores: en `arrays.ts` hay `tailwind` y
`css`, y ninguna de las dos está en la lista de `Technology` que dais en el primer ejercicio.

He optado por añadirlas al tipo, porque me parecía peor tocar los datos que me disteis, pero no sé
si preferíais que la lista se quedara cerrada tal cual y que ajustara los arrays. Lo he dejado
comentado en `types.ts` para que se vea.

**Respuesta:** Bien visto! Excelente decisión. Algunos alumnos modificaron los datos, y algunos otros los types. Lo que hiciste es acertado.

## He añadido TypeScript al proyecto para poder comprobar los tipos

El ejercicio no traía TypeScript ni `tsconfig.json`, y me di cuenta de que al ejecutar con Node los
tipos no se comprueban: solo se borran, así que el programa corre igual aunque esté todo mal
tipado. Sin `tsc` no tenía forma de saber si lo estaba haciendo bien, así que lo he instalado como
dependencia de desarrollo con un `tsconfig` en modo estricto y he añadido un script `typecheck`.

¿Estaba previsto que lo hiciéramos así o teníais otra forma de validarlo?

**Respuesta:** En el Bootcamp hemos hablado de `tsconfig.json`, y por más que no estuviese explicito en la letra del ejercicio, agregarlo fue lo correcto. No hemos penalizado el no tenerlo, pero si consideramos que es lo mejor.

## node index.ts me pedía un flag

Con la versión de Node que tengo (22.16) `node index.ts` no arranca, hay que ejecutarlo como
`node --experimental-strip-types index.ts`. Entiendo que a partir de Node 23.6 ya funciona sin el
flag. Lo he dejado en el script `start` del package.json para no tener que acordarme.

**Respuesta:** Muy bien! Hemos estado usando node 24.x o 26.x, por eso asumimos el no especificar el flag. Si tienes esa versión, no hay problema. Lo resolviste bien.

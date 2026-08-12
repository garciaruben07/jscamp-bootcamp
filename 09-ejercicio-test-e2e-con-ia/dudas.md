<!-- Aquí puedes introducir tus dudas sobre el ejercicio, la consigna, la corrección, etc -->

## Tuve que tocar la app del cuarto ejercicio para que los tests fueran posibles

Me encontré con dos cosas que el enunciado da por hechas y que mi aplicación no tenía:

El tercer ejercicio dice de localizar el buscador con `getByRole('searchbox')`, pero mis inputs
eran `type="text"`, cuyo rol es `textbox`, así que no los encontraba. Los he pasado a
`type="search"`, que además es lo correcto para un buscador.

Y los ejercicios cuarto y séptimo piden entrar al detalle de una oferta y aplicar desde ahí, pero
mi página de detalle solo mostraba la información: el botón de aplicar estaba únicamente en la
tarjeta del listado, porque el enunciado del módulo anterior no pedía otra cosa. Le he añadido los
botones de aplicar y de favoritos.

¿Era la idea que adaptáramos la aplicación, o preferíais que los tests se ajustaran a lo que cada
uno tuviera hecho?

## La paginación no tenía forma de localizarse por rol

El sexto ejercicio pide hacer clic en "Siguiente", pero en el componente `Pagination` esas flechas
son enlaces que solo llevan un svg dentro, sin texto ni `aria-label`, así que no hay manera de
buscarlas por rol y nombre como recomienda la jerarquía de selectores del enunciado. Les he puesto
`aria-label` y `title` siguiendo la corrección del primer ejercicio, y de paso `aria-current` en la
página activa. ¿Bien así?

## Los tests dependen de que la aplicación esté levantada a mano

Ahora mismo hay que arrancar la app en el 5173 antes de lanzar Playwright, y si no está los tests
fallan sin más. He visto que el `playwright.config.js` trae comentada una sección `webServer` que
serviría para arrancarla sola, pero como la app vive en otra carpeta del repositorio no sabía si
queríais que la usáramos. Lo he dejado como está.

<!-- Aquí puedes introducir tus dudas sobre el ejercicio, la consigna, la corrección, etc -->

## El filtro de ubicación no me cuadra con los datos

Haciendo el tercer desafío vi que el select de ubicación tiene los valores remoto, cdmx,
guadalajara, monterrey y barcelona, y esos son justo los que hay en `data.modalidad`, no en
`ubicacion`. Al final he filtrado por modalidad porque es lo único que coincide con los value del
select.

Lo que pasa es que salen cosas raras. Si filtro por Monterrey aparece "Frontend Developer", que en
la tarjeta pone Valencia, y si filtro por Remoto aparece "Administrador de Bases de Datos", que pone
Buenos Aires. ¿Lo he enfocado bien o los dos campos deberían coincidir?

**Respuesta:**
Muy bien observado! Lo hiciste perfecto, fue un error que tuvimos al crear el ejercicio (coincidencia de datos con los filtros), y como ya lo habían hecho muchos alumnos no había lugar para cambiarlo.

Lo tenemos en cuenta y tranquilo que lo has hecho perfecto!

## ¿Los filtros se tienen que sumar entre ellos?

Como cada desafío iba por separado no tenía claro qué pasa al elegir dos cosas a la vez. Si marco
Remoto y Senior, ¿tienen que salir solo las ofertas que cumplan las dos, o el último filtro que
tocas manda sobre el anterior? Lo he hecho sumándolos, que me parecía lo lógico, pero no lo tengo
claro del todo.

**Respuesta:**
Perfecto! La idea es sumar los filtros, cuanto más filtros selecciona el usuario, más específico es el resultado que quiere recibir.
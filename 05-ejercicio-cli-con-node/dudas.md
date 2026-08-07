## Aquí puedes poner tus dudas sobre el ejercicio

## El comando del cuarto ejercicio no me activaba los permisos

En el enunciado pone `node cli.js --permission`, pero puesto así el `--permission` le llega a mi
script como un argumento más y Node no activa nada, porque sus flags van antes del fichero. Además,
al activarlos hay que darle permiso para leer el propio `cli.js` o ni siquiera puede cargarlo.

Al final lo he probado con `node --permission --allow-fs-read=. cli.js /etc`, que sí deniega y me
deja mostrar el mensaje, y con `--allow-fs-read=/etc` añadido para el caso en el que sí hay permiso.
¿Es esa la idea o esperabais otra forma de ejecutarlo?

## Qué hacer si se ponen dos flags que se contradicen

No sé qué debería pasar si alguien escribe `--asc --desc` juntos, o `--files --folders`. He hecho
que gane el primero de los dos, pero igual tendría más sentido avisar de que se contradicen.

## Duda pequeña del ejemplo del primer ejercicio

En la lista de objetivos pone que el `-` es para las carpetas, pero en el ejemplo de salida el
`index.js`, que es un archivo, también sale con `-`. He seguido lo que dice el texto y a los
archivos les pongo siempre su tamaño.

import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'

const UNIDADES = ['B', 'KB', 'MB', 'GB', 'TB']
const ANCHO_MINIMO = 24

/* Los argumentos del usuario empiezan en la posición 2: antes van node y el propio script */
const args = process.argv.slice(2)

/* El directorio es el primer argumento que no sea un flag; si no lo hay, el actual */
const directorio = args.find((arg) => !arg.startsWith('--')) ?? '.'

/* Los flags se buscan en todo el array, así el usuario puede ponerlos donde quiera */
const orden = args.includes('--asc') ? 'asc' : args.includes('--desc') ? 'desc' : null

function formatearTamano(bytes) {
  let valor = bytes
  let unidad = 0

  while (valor >= 1024 && unidad < UNIDADES.length - 1) {
    valor = valor / 1024
    unidad++
  }

  return `${unidad === 0 ? valor : valor.toFixed(2)} ${UNIDADES[unidad]}`
}

async function obtenerEntradas(directorio) {
  const nombres = await readdir(directorio)

  return Promise.all(
    nombres.map(async (nombre) => {
      const info = await stat(join(directorio, nombre))

      return {
        nombre,
        esDirectorio: info.isDirectory(),
        tamano: info.size,
      }
    })
  )
}

function ordenar(entradas, orden) {
  if (orden === null) return entradas

  /* Copia con toSorted para no mutar el array original */
  const ordenadas = entradas.toSorted((a, b) => a.nombre.localeCompare(b.nombre))

  return orden === 'asc' ? ordenadas : ordenadas.toReversed()
}

function mostrar(entradas) {
  /* La columna se ajusta al nombre más largo para que los tamaños queden alineados */
  const ancho = Math.max(ANCHO_MINIMO, ...entradas.map((entrada) => entrada.nombre.length))

  for (const entrada of entradas) {
    const icono = entrada.esDirectorio ? '📁' : '📄'
    const tamano = entrada.esDirectorio ? '-' : formatearTamano(entrada.tamano)

    console.log(`${icono} ${entrada.nombre.padEnd(ancho)} ${tamano}`)
  }
}

const entradas = await obtenerEntradas(directorio)
mostrar(ordenar(entradas, orden))

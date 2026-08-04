import { createServer } from 'node:http'
import { randomUUID } from 'node:crypto'
import { json } from 'node:stream/consumers'

process.loadEnvFile()

const port = process.env.PORT || 3000

/* Toda la API responde JSON, así que centralizamos cabecera, estado y serialización */
function enviarJson(res, statusCode, datos) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(datos))
}

/* Devuelve null si el parámetro no viene o no es un número usable, para poder ignorarlo */
function leerNumero(searchParams, clave) {
  const valor = searchParams.get(clave)

  if (valor === null || valor.trim() === '') return null

  const numero = Number(valor)

  return Number.isNaN(numero) ? null : numero
}

/* Cada filtro se aplica solo si viene su parámetro, así se pueden combinar entre ellos */
function filtrarUsuarios(users, searchParams) {
  const name = searchParams.get('name')
  const minAge = leerNumero(searchParams, 'minAge')
  const maxAge = leerNumero(searchParams, 'maxAge')

  let resultado = users

  if (name !== null) {
    const busqueda = name.trim().toLowerCase()
    resultado = resultado.filter((user) => user.name.toLowerCase().includes(busqueda))
  }

  if (minAge !== null) {
    resultado = resultado.filter((user) => user.age >= minAge)
  }

  if (maxAge !== null) {
    resultado = resultado.filter((user) => user.age <= maxAge)
  }

  return resultado
}

/* La paginación va al final: se pagina sobre lo ya filtrado */
function paginarUsuarios(users, searchParams) {
  const limit = leerNumero(searchParams, 'limit')
  const offset = leerNumero(searchParams, 'offset')

  if (limit === null && offset === null) return users

  /* Un offset negativo haría que slice contase desde el final */
  const desde = Math.max(0, offset ?? 0)
  const hasta = limit === null ? users.length : desde + Math.max(0, limit)

  return users.slice(desde, hasta)
}

const server = createServer(async (req, res) => {
  /* req.url llega sin origen, así que hace falta una base para poder parsearlo */
  const { pathname, searchParams } = new URL(req.url, `http://${req.headers.host}`)

  if (req.method === 'GET' && pathname === '/users') {
    const filtrados = filtrarUsuarios(users, searchParams)

    return enviarJson(res, 200, paginarUsuarios(filtrados, searchParams))
  }

  if (req.method === 'POST' && pathname === '/users') {
    let body

    try {
      body = await json(req)
    } catch {
      return enviarJson(res, 400, { error: 'El cuerpo de la petición no es un JSON válido' })
    }

    const { name, age } = body ?? {}

    if (typeof name !== 'string' || name.trim() === '') {
      return enviarJson(res, 400, { error: 'El campo name es obligatorio y debe ser texto' })
    }

    if (typeof age !== 'number' || !Number.isInteger(age) || age < 0) {
      return enviarJson(res, 400, { error: 'El campo age es obligatorio y debe ser un entero positivo' })
    }

    const nuevoUsuario = { id: randomUUID(), name: name.trim(), age }
    users.push(nuevoUsuario)

    return enviarJson(res, 201, nuevoUsuario)
  }

  if (req.method === 'GET' && pathname === '/health') {
    return enviarJson(res, 200, { status: 'ok', uptime: process.uptime() })
  }

  /* Si ninguna ruta ha respondido, no existe */
  return enviarJson(res, 404, { error: 'Ruta no encontrada' })
})

server.listen(port, () => {
  const address = server.address()
  console.log(`Servidor escuchando en http://localhost:${address.port}`)
})

const users = [
  {
    id: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
    name: 'Miguel',
    age: 28,
  },
  {
    id: 'f6e5d4c3-b2a1-4f5e-6d7c-8b9a0e1f2a3b',
    name: 'Mateo',
    age: 34,
  },
  {
    id: '9a8b7c6d-5e4f-4a3b-2c1d-0e9f8a7b6c5d',
    name: 'Pablo',
    age: 22,
  },
  {
    id: '3c4d5e6f-7a8b-4c9d-0e1f-2a3b4c5d6e7f',
    name: 'Lucía',
    age: 31,
  },
  {
    id: '7b8c9d0e-1f2a-4b3c-4d5e-6f7a8b9c0d1e',
    name: 'Ana',
    age: 26,
  },
  {
    id: '5d6e7f8a-9b0c-4d1e-2f3a-4b5c6d7e8f9a',
    name: 'Juan',
    age: 29,
  },
  {
    id: '2a3b4c5d-6e7f-4a8b-9c0d-1e2f3a4b5c6d',
    name: 'Sofía',
    age: 25,
  },
  {
    id: '8f9a0b1c-2d3e-4f5a-6b7c-8d9e0f1a2b3c',
    name: 'Carlos',
    age: 37,
  },
  {
    id: '4c5d6e7f-8a9b-4c0d-1e2f-3a4b5c6d7e8f',
    name: 'Elena',
    age: 23,
  },
  {
    id: '0e1f2a3b-4c5d-4e6f-7a8b-9c0d1e2f3a4b',
    name: 'Diego',
    age: 30,
  },
]

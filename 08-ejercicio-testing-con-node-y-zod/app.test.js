import assert from 'node:assert'
import { after, before, describe, test } from 'node:test'
import app from './app.js'

const PORT = 5678
const BASE_URL = `http://localhost:${PORT}`

/* IDs que vienen en jobs.json y que solo se leen, nunca se modifican */
const ID_EXISTENTE = 'd35b2c89-5d60-4f26-b19a-6cfb2f1a0f57'
const ID_INEXISTENTE = 'no-existe-este-id'

const JOB_VALIDO = {
  titulo: 'Ingeniero DevOps',
  empresa: 'CloudTech',
  ubicacion: 'Remoto',
  descripcion: 'Buscamos un ingeniero DevOps con experiencia en contenedores.',
  data: { technology: ['docker', 'kubernetes'], modalidad: 'remoto', nivel: 'senior' },
}

let server

/* Cada test que modifica datos trabaja sobre un job recién creado, para no depender del orden */
async function crearJob(cambios = {}) {
  const response = await fetch(`${BASE_URL}/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...JOB_VALIDO, ...cambios }),
  })

  return response.json()
}

before(async () => {
  server = app.listen(PORT)
})

after(async () => {
  server.close()
})

/* Cuando hay partes del test que se repiten mucho, podemos hacer una función que agrupe */
const handleGetAndCheckStatus = async (path = '/jobs', status = 200) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}` // Así permitimos al dev pasar el path como quiera

  const response = await fetch(`${BASE_URL}${normalizedPath}`)
  const json = await response.json()

  assert.strictEqual(response.status, status)

  return json
} 

describe('GET /jobs', () => {
  test('Debe responder con 200 y un array de trabajos', async () => {
    const json = await handleGetAndCheckStatus('/jobs')
    assert.ok(Array.isArray(json.data))
  })

  test('Debe filtrar trabajos por tecnología', async () => {
    const TECHNOLOGY = 'react'
    const json = await handleGetAndCheckStatus(`/jobs?technology=${TECHNOLOGY}`)

    assert.ok(json.data.length > 0, 'debería devolver al menos un trabajo con react')
    assert.ok(json.data.every((job) => job.data.technology.includes('react')))
  })

  test('Debe respetar el límite de resultados', async () => {
    const LIMIT = 2
    const json = await handleGetAndCheckStatus(`/jobs?limit=${LIMIT}`)

    assert.strictEqual(json.limit, 2)
    assert.strictEqual(json.data.length, 2)
  })

  test('Debe aplicar offset correctamente', async () => {
    const OFFSET = 1
    const json = await handleGetAndCheckStatus(`/jobs?offset=${OFFSET}`)

    assert.strictEqual(json.offset, 1)
    assert.strictEqual(json.data[0].id, ID_EXISTENTE)
  })
})

// Podemos hacer lo mismo para POST
const handlePostAndCheckStatus = async (path = '/jobs', {
  status = 201,
  body = JOB_VALIDO,
}) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  const response = await fetch(`${BASE_URL}${normalizedPath}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  assert.strictEqual(response.status, status)

  return response.json()
}

describe('POST /jobs', () => {
  test('El nuevo trabajo se añade correctamente con buen formato', async () => {
    const json = await handlePostAndCheckStatus('/jobs', { body: JOB_VALIDO })

    assert.ok(json.id, 'el trabajo creado debe traer un id generado')
    assert.strictEqual(json.titulo, JOB_VALIDO.titulo)
    assert.strictEqual(json.empresa, JOB_VALIDO.empresa)
    assert.strictEqual(json.ubicacion, JOB_VALIDO.ubicacion)
  })

  test('Debe rechazar un título de menos de 3 caracteres', async () => {
    await handlePostAndCheckStatus('/jobs', {
      body: { ...JOB_VALIDO, titulo: 'ab' },
      status: 400,
    })
  })

  test('Debe rechazar un título de más de 100 caracteres', async () => {
    await handlePostAndCheckStatus('/jobs', {
      body: { ...JOB_VALIDO, titulo: 'a'.repeat(101) },
      status: 400,
    })
  })

  test('Debe rechazar una petición sin título', async () => {
    const { titulo, ...sinTitulo } = JOB_VALIDO

    const response = await fetch(`${BASE_URL}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sinTitulo),
    })

    assert.strictEqual(response.status, 400)
  })

  test('Debe rechazar un título que no sea texto', async () => {
    const response = await fetch(`${BASE_URL}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...JOB_VALIDO, titulo: 12345 }),
    })

    assert.strictEqual(response.status, 400)
  })

  test('Debe aceptar una petición sin descripción, porque es opcional', async () => {
    const { descripcion, ...sinDescripcion } = JOB_VALIDO

    const response = await fetch(`${BASE_URL}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sinDescripcion),
    })

    assert.strictEqual(response.status, 201)
  })
})

describe('GET /jobs/:id', () => {
  test('Debe devolver el trabajo con el ID especificado', async () => {
    const response = await fetch(`${BASE_URL}/jobs/${ID_EXISTENTE}`)
    const json = await response.json()

    assert.strictEqual(response.status, 200)
    assert.strictEqual(json.id, ID_EXISTENTE)
  })

  test('Debe enviar 404 cuando el ID no existe', async () => {
    const response = await fetch(`${BASE_URL}/jobs/${ID_INEXISTENTE}`)
    const json = await response.json()

    assert.strictEqual(response.status, 404)
    assert.ok(json.error)
  })
})

describe('PUT /jobs/:id', () => {
  test('Debe recibir 204 y actualizar el trabajo', async () => {
    const job = await crearJob()

    const cambios = { ...JOB_VALIDO, titulo: 'Título reemplazado', ubicacion: 'Barcelona' }

    const response = await fetch(`${BASE_URL}/jobs/${job.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cambios),
    })

    assert.strictEqual(response.status, 204)

    const comprobacion = await fetch(`${BASE_URL}/jobs/${job.id}`)
    const actualizado = await comprobacion.json()

    assert.strictEqual(actualizado.titulo, 'Título reemplazado')
    assert.strictEqual(actualizado.ubicacion, 'Barcelona')
    assert.strictEqual(actualizado.id, job.id, 'el id no debe cambiar')
  })

  test('Debe devolver 404 cuando el ID no existe', async () => {
    const response = await fetch(`${BASE_URL}/jobs/${ID_INEXISTENTE}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(JOB_VALIDO),
    })

    assert.strictEqual(response.status, 404)
  })
})

describe('PATCH /jobs/:id', () => {
  test('Debe recibir 204 y actualizar solo los campos enviados', async () => {
    const job = await crearJob()

    const response = await fetch(`${BASE_URL}/jobs/${job.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo: 'Título parcheado', ubicacion: 'Valencia' }),
    })

    assert.strictEqual(response.status, 204)

    const comprobacion = await fetch(`${BASE_URL}/jobs/${job.id}`)
    const actualizado = await comprobacion.json()

    assert.strictEqual(actualizado.titulo, 'Título parcheado')
    assert.strictEqual(actualizado.ubicacion, 'Valencia')
    assert.strictEqual(actualizado.empresa, JOB_VALIDO.empresa, 'la empresa no debía cambiar')
    assert.strictEqual(actualizado.descripcion, JOB_VALIDO.descripcion, 'la descripción tampoco')
  })

  test('Debe devolver 404 cuando el ID no existe', async () => {
    const response = await fetch(`${BASE_URL}/jobs/${ID_INEXISTENTE}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo: 'Da igual' }),
    })

    assert.strictEqual(response.status, 404)
  })
})

describe('DELETE /jobs/:id', () => {
  test('Debe recibir 204 y eliminar el trabajo', async () => {
    const job = await crearJob()

    const response = await fetch(`${BASE_URL}/jobs/${job.id}`, { method: 'DELETE' })

    assert.strictEqual(response.status, 204)

    const comprobacion = await fetch(`${BASE_URL}/jobs/${job.id}`)

    assert.strictEqual(comprobacion.status, 404)
  })

  test('Debe devolver 404 cuando el ID no existe', async () => {
    const response = await fetch(`${BASE_URL}/jobs/${ID_INEXISTENTE}`, { method: 'DELETE' })

    assert.strictEqual(response.status, 404)
  })
})

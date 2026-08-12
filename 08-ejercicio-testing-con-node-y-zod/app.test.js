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

/* Cuando hay partes del test que se repiten mucho, podemos hacer una función que agrupe.
   Esta es la base de todas: lanza la petición y comprueba el estado que se espera */
const request = async (method, path, { status, body } = {}) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}` // Así permitimos al dev pasar el path como quiera

  const options = { method }

  /* Solo los métodos que mandan datos necesitan cabecera y cuerpo */
  if (body !== undefined) {
    options.headers = { 'Content-Type': 'application/json' }
    options.body = JSON.stringify(body)
  }

  const response = await fetch(`${BASE_URL}${normalizedPath}`, options)

  assert.strictEqual(response.status, status)

  return response
}

/* GET y POST siempre responden con un cuerpo, así que sus atajos devuelven el JSON ya parseado */
const handleGetAndCheckStatus = async (path = '/jobs', status = 200) => {
  const response = await request('GET', path, { status })

  return response.json()
}

const handlePostAndCheckStatus = async (path = '/jobs', { status = 201, body = JOB_VALIDO } = {}) => {
  const response = await request('POST', path, { status, body })

  return response.json()
}

/* PUT, PATCH y DELETE responden 204, que por definición no lleva cuerpo: llamar a .json()
   aquí reventaría, así que estos atajos se quedan en comprobar el estado */
const handlePutAndCheckStatus = (path, { status = 204, body = JOB_VALIDO } = {}) =>
  request('PUT', path, { status, body })

const handlePatchAndCheckStatus = (path, { status = 204, body = {} } = {}) =>
  request('PATCH', path, { status, body })

const handleDeleteAndCheckStatus = (path, { status = 204 } = {}) => request('DELETE', path, { status })

/* Cada test que modifica datos trabaja sobre un job recién creado, para no depender del orden */
async function crearJob(cambios = {}) {
  return handlePostAndCheckStatus('/jobs', { body: { ...JOB_VALIDO, ...cambios } })
}

before(async () => {
  server = app.listen(PORT)
})

after(async () => {
  server.close()
})

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

    assert.strictEqual(json.limit, LIMIT)
    assert.strictEqual(json.data.length, LIMIT)
  })

  test('Debe aplicar offset correctamente', async () => {
    const OFFSET = 1
    const json = await handleGetAndCheckStatus(`/jobs?offset=${OFFSET}`)

    assert.strictEqual(json.offset, OFFSET)
    assert.strictEqual(json.data[0].id, ID_EXISTENTE)
  })
})

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

    await handlePostAndCheckStatus('/jobs', { body: sinTitulo, status: 400 })
  })

  test('Debe rechazar un título que no sea texto', async () => {
    await handlePostAndCheckStatus('/jobs', {
      body: { ...JOB_VALIDO, titulo: 12345 },
      status: 400,
    })
  })

  test('Debe aceptar una petición sin descripción, porque es opcional', async () => {
    const { descripcion, ...sinDescripcion } = JOB_VALIDO

    await handlePostAndCheckStatus('/jobs', { body: sinDescripcion })
  })
})

describe('GET /jobs/:id', () => {
  test('Debe devolver el trabajo con el ID especificado', async () => {
    const json = await handleGetAndCheckStatus(`/jobs/${ID_EXISTENTE}`)

    assert.strictEqual(json.id, ID_EXISTENTE)
  })

  test('Debe enviar 404 cuando el ID no existe', async () => {
    const json = await handleGetAndCheckStatus(`/jobs/${ID_INEXISTENTE}`, 404)

    assert.ok(json.error)
  })
})

describe('PUT /jobs/:id', () => {
  test('Debe recibir 204 y actualizar el trabajo', async () => {
    const job = await crearJob()

    const cambios = { ...JOB_VALIDO, titulo: 'Título reemplazado', ubicacion: 'Barcelona' }

    await handlePutAndCheckStatus(`/jobs/${job.id}`, { body: cambios })

    const actualizado = await handleGetAndCheckStatus(`/jobs/${job.id}`)

    assert.strictEqual(actualizado.titulo, 'Título reemplazado')
    assert.strictEqual(actualizado.ubicacion, 'Barcelona')
    assert.strictEqual(actualizado.id, job.id, 'el id no debe cambiar')
  })

  test('Debe devolver 404 cuando el ID no existe', async () => {
    await handlePutAndCheckStatus(`/jobs/${ID_INEXISTENTE}`, { status: 404 })
  })
})

describe('PATCH /jobs/:id', () => {
  test('Debe recibir 204 y actualizar solo los campos enviados', async () => {
    const job = await crearJob()

    await handlePatchAndCheckStatus(`/jobs/${job.id}`, {
      body: { titulo: 'Título parcheado', ubicacion: 'Valencia' },
    })

    const actualizado = await handleGetAndCheckStatus(`/jobs/${job.id}`)

    assert.strictEqual(actualizado.titulo, 'Título parcheado')
    assert.strictEqual(actualizado.ubicacion, 'Valencia')
    assert.strictEqual(actualizado.empresa, JOB_VALIDO.empresa, 'la empresa no debía cambiar')
    assert.strictEqual(actualizado.descripcion, JOB_VALIDO.descripcion, 'la descripción tampoco')
  })

  test('Debe devolver 404 cuando el ID no existe', async () => {
    await handlePatchAndCheckStatus(`/jobs/${ID_INEXISTENTE}`, {
      body: { titulo: 'Da igual' },
      status: 404,
    })
  })
})

describe('DELETE /jobs/:id', () => {
  test('Debe recibir 204 y eliminar el trabajo', async () => {
    const job = await crearJob()

    await handleDeleteAndCheckStatus(`/jobs/${job.id}`)

    await handleGetAndCheckStatus(`/jobs/${job.id}`, 404)
  })

  test('Debe devolver 404 cuando el ID no existe', async () => {
    await handleDeleteAndCheckStatus(`/jobs/${ID_INEXISTENTE}`, { status: 404 })
  })
})

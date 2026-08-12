import { DEFAULTS } from '../config.js'
import { JobModel } from '../models/jobs.js'

/* Los query params llegan siempre como texto; si no son un entero válido se usa el valor por defecto */
function aEntero(valor, porDefecto) {
  if (valor === undefined || valor === '') return porDefecto

  const numero = Number(valor)

  return Number.isInteger(numero) && numero >= 0 ? numero : porDefecto
}

// Excelente idea! Algo que podemos hacer para llevarlo a otro nivel es hacer que esta lista sea inmutable.
// Por que? Para estar seguros de que la fuente de la verdad es esta lista, y que no debe ser modificada en ninguna parte del código.
// Con esto evitamos que, por distracción o error, agreguemos un campo a la lista que no querramos.
// Usamos `Object.freeze` para que no se puedan modificar las propiedades de la lista.
// Si intentas modificarla con un push, pop, etc, obtendrás un error.
const CAMPOS = Object.freeze(['titulo', 'empresa', 'ubicacion', 'descripcion', 'data', 'content'])
// const CAMPOS = ['titulo', 'empresa', 'ubicacion', 'descripcion', 'data', 'content']

/* Devuelve la lista de campos que faltan o vienen vacíos, para poder decir cuáles fallan */
function camposInvalidos(body) {
  return CAMPOS.filter((campo) => {
    const valor = body[campo]

    if (valor === undefined || valor === null) return true
    if (typeof valor === 'string') return valor.trim() === ''

    return false
  })
}

export class JobController {
  static getAll(req, res) {
    const { text, title, level, technology } = req.query

    const limit = aEntero(req.query.limit, DEFAULTS.LIMIT_PAGINATION)
    const offset = aEntero(req.query.offset, DEFAULTS.LIMIT_OFFSET)

    const { data, total } = JobModel.getAll({ text, title, level, technology, limit, offset })

    res.json({ data, total, limit, offset })
  }

  static getId(req, res) {
    const job = JobModel.getById(req.params.id)

    if (job === null) {
      return res.status(404).json({ error: 'Job not found' })
    }

    res.json(job)
  }

  static create(req, res) {
    const faltan = camposInvalidos(req.body ?? {})

    if (faltan.length > 0) {
      return res.status(400).json({ error: `Faltan campos obligatorios: ${faltan.join(', ')}` })
    }

    const nuevoJob = JobModel.create(req.body)

    res.status(201).json(nuevoJob)
  }

  static update(req, res) {
    const faltan = camposInvalidos(req.body ?? {})

    if (faltan.length > 0) {
      return res.status(400).json({ error: `Faltan campos obligatorios: ${faltan.join(', ')}` })
    }

    const actualizado = JobModel.update(req.params.id, req.body)

    if (actualizado === null) {
      return res.status(404).json({ error: 'Job not found' })
    }

    res.json(actualizado)
  }

  static partialUpdate(req, res) {
    /* Solo se aceptan los campos conocidos, para que nadie cuele propiedades sueltas ni pise el id */
    const cambios = Object.fromEntries(
      Object.entries(req.body ?? {}).filter(([clave]) => CAMPOS.includes(clave))
    )

    if (Object.keys(cambios).length === 0) {
      return res.status(400).json({ error: 'No se ha indicado ningún campo que actualizar' })
    }

    const actualizado = JobModel.partialUpdate(req.params.id, cambios)

    if (actualizado === null) {
      return res.status(404).json({ error: 'Job not found' })
    }

    res.json(actualizado)
  }

  static delete(req, res) {
    const eliminado = JobModel.delete(req.params.id)

    if (eliminado === null) {
      return res.status(404).json({ error: 'Job not found' })
    }

    res.json({ message: 'Job deleted', job: eliminado })
  }
}

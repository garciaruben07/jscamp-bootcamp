import { JobModel } from '../models/jobs.js'
import { DEFAULTS } from '../config.js'

/* Los query params llegan siempre como texto; si no son un entero válido se usa el valor por defecto */
function aEntero(valor, porDefecto) {
  if (valor === undefined || valor === '') return porDefecto

  const numero = Number(valor)

  return Number.isInteger(numero) && numero >= 0 ? numero : porDefecto
}

export class JobController {
  static getAll(req, res) {
    const { text, title, level, technology } = req.query

    const limit = aEntero(req.query.limit, DEFAULTS.LIMIT_PAGINATION)
    const offset = aEntero(req.query.offset, DEFAULTS.LIMIT_OFFSET)

    const { data, total } = JobModel.getAll({ text, title, level, technology, limit, offset })

    res.json({ data, total, limit, offset })
  }
}

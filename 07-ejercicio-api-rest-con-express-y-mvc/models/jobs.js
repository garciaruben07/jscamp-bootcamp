import { randomUUID } from 'node:crypto'
import jobs from '../jobs.json' with { type: 'json' }

export class JobModel {
  /* Cada filtro se aplica solo si viene su valor, así se pueden combinar entre ellos.
     Devuelve también el total sin paginar, que es lo que permite saber cuántas páginas hay. */
  static getAll({ text, title, level, technology, limit, offset }) {
    let resultado = jobs

    if (title) {
      const busqueda = title.toLowerCase()
      resultado = resultado.filter((job) => job.titulo.toLowerCase().includes(busqueda))
    }

    if (text) {
      const busqueda = text.toLowerCase()
      resultado = resultado.filter(
        (job) =>
          job.titulo.toLowerCase().includes(busqueda) ||
          job.descripcion.toLowerCase().includes(busqueda)
      )
    }

    if (technology) {
      const busqueda = technology.toLowerCase()
      resultado = resultado.filter((job) => job.data.technology.includes(busqueda))
    }

    if (level) {
      const busqueda = level.toLowerCase()
      resultado = resultado.filter((job) => job.data.nivel.toLowerCase() === busqueda)
    }

    return {
      data: resultado.slice(offset, offset + limit),
      total: resultado.length,
    }
  }

  static getById(id) {
    return jobs.find((job) => job.id === id) ?? null
  }

  static create({ titulo, empresa, ubicacion, descripcion, data, content }) {
    const nuevoJob = { id: randomUUID(), titulo, empresa, ubicacion, descripcion, data, content }

    jobs.push(nuevoJob)

    return nuevoJob
  }

  /* PUT reemplaza el job entero, conservando solo el id */
  static update(id, { titulo, empresa, ubicacion, descripcion, data, content }) {
    const indice = jobs.findIndex((job) => job.id === id)

    if (indice === -1) return null

    jobs[indice] = { id, titulo, empresa, ubicacion, descripcion, data, content }

    return jobs[indice]
  }

  /* PATCH solo pisa los campos recibidos y deja intactos los demás */
  static partialUpdate(id, cambios) {
    const indice = jobs.findIndex((job) => job.id === id)

    if (indice === -1) return null

    jobs[indice] = { ...jobs[indice], ...cambios, id }

    return jobs[indice]
  }

  static delete(id) {
    const indice = jobs.findIndex((job) => job.id === id)

    if (indice === -1) return null

    const [eliminado] = jobs.splice(indice, 1)

    return eliminado
  }
}

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
}

import crypto from 'node:crypto'
import { db } from '../db/database'
import type { Job, JobData, CreateJobDTO, UpdateJobDTO, JobFilters } from '../types'

// ================================
// FILA QUE DEVUELVE SQLITE
// ================================

// Las tecnologías llegan como un array JSON y el contenido llega aplanado con
// prefijo, porque una fila SQL no puede anidar objetos
interface JobRow {
  id: string
  title: string
  company: string
  location: string
  description: string
  modality: JobData['modality']
  level: JobData['level']
  technologies: string
  content_description: string | null
  content_responsibilities: string | null
  content_requirements: string | null
  content_about: string | null
}

// ================================
// CONSULTA BASE
// ================================

// La subconsulta evita el N+1 de pedir las tecnologías job a job. Se usa
// json_group_array y no group_concat porque devuelve JSON válido y no se rompe
// si algún día una tecnología lleva una coma
const SELECT_JOB = `
  SELECT
    j.id,
    j.title,
    j.company,
    j.location,
    j.description,
    j.modality,
    j.level,
    (
      SELECT json_group_array(t.technology)
      FROM job_technologies t
      WHERE t.job_id = j.id
    ) AS technologies,
    c.description      AS content_description,
    c.responsibilities AS content_responsibilities,
    c.requirements     AS content_requirements,
    c.about            AS content_about
  FROM jobs j
  LEFT JOIN job_content c ON c.job_id = j.id
`

// ================================
// SENTENCIAS PREPARADAS
// ================================

// better-sqlite3 no cachea los prepare, así que las sentencias fijas se preparan
// una sola vez al cargar el módulo
const selectById = db.prepare(`${SELECT_JOB} WHERE j.id = ?`)

const insertJob = db.prepare(`
  INSERT INTO jobs (id, title, company, location, description, modality, level)
  VALUES (@id, @title, @company, @location, @description, @modality, @level)
`)

const updateJob = db.prepare(`
  UPDATE jobs
  SET title = @title,
      company = @company,
      location = @location,
      description = @description,
      modality = @modality,
      level = @level
  WHERE id = @id
`)

const deleteJob = db.prepare('DELETE FROM jobs WHERE id = ?')

const insertTechnology = db.prepare(`
  INSERT INTO job_technologies (job_id, technology)
  VALUES (?, ?)
`)

const deleteTechnologies = db.prepare('DELETE FROM job_technologies WHERE job_id = ?')

const insertContent = db.prepare(`
  INSERT INTO job_content (id, job_id, description, responsibilities, requirements, about)
  VALUES (@id, @jobId, @description, @responsibilities, @requirements, @about)
`)

const deleteContent = db.prepare('DELETE FROM job_content WHERE job_id = ?')

// ================================
// HELPERS
// ================================

function toJob(row: JobRow): Job {
  const job: Job = {
    id: row.id,
    title: row.title,
    company: row.company,
    location: row.location,
    description: row.description,
    data: {
      technology: JSON.parse(row.technologies),
      modality: row.modality,
      level: row.level,
    },
  }

  if (row.content_description !== null) {
    job.content = {
      description: row.content_description,
      responsibilities: row.content_responsibilities ?? '',
      requirements: row.content_requirements ?? '',
      about: row.content_about ?? '',
    }
  }

  return job
}

// Versión síncrona de la lectura por id, para poder reutilizarla dentro de una
// transacción: better-sqlite3 no admite awaits en mitad de una
function findById(id: string): Job | undefined {
  const row = selectById.get(id) as JobRow | undefined

  return row && toJob(row)
}

// Las tres tablas se escriben juntas, así que las escrituras de las tablas hijas
// se comparten entre create y update
function writeTechnologies(jobId: string, technologies: string[]): void {
  deleteTechnologies.run(jobId)

  technologies.forEach((technology) => {
    insertTechnology.run(jobId, technology)
  })
}

function writeContent(jobId: string, content: Job['content']): void {
  deleteContent.run(jobId)

  if (!content) return

  insertContent.run({
    id: crypto.randomUUID(),
    jobId,
    description: content.description,
    responsibilities: content.responsibilities,
    requirements: content.requirements,
    about: content.about,
  })
}

export class JobModel {
  // Obtener todos los jobs con filtros opcionales
  static async getAll(filters?: JobFilters): Promise<Job[]> {
    const conditions: string[] = []
    const values: string[] = []

    // La tecnología vive en otra tabla, así que se filtra comprobando que exista
    // al menos una fila suya para ese job
    if (filters?.tech) {
      conditions.push(`
        EXISTS (
          SELECT 1
          FROM job_technologies t
          WHERE t.job_id = j.id AND t.technology = ? COLLATE NOCASE
        )
      `)
      values.push(filters.tech)
    }

    if (filters?.modality) {
      conditions.push('j.modality = ?')
      values.push(filters.modality)
    }

    if (filters?.level) {
      conditions.push('j.level = ?')
      values.push(filters.level)
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
    const rows = db.prepare(`${SELECT_JOB} ${where}`).all(...values) as JobRow[]

    return rows.map(toJob)
  }

  // Obtener un job por ID
  static async getById(id: string): Promise<Job | undefined> {
    return findById(id)
  }

  // Crear un nuevo job
  static async create(input: CreateJobDTO): Promise<Job> {
    const newJob: Job = {
      id: crypto.randomUUID(),
      ...input,
    }

    // Un job incompleto no debe quedar visible si falla una de las tres escrituras
    const create = db.transaction((job: Job) => {
      insertJob.run({
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        description: job.description,
        modality: job.data.modality,
        level: job.data.level,
      })

      writeTechnologies(job.id, job.data.technology)
      writeContent(job.id, job.content)
    })

    create(newJob)

    return newJob
  }

  // Eliminar un job
  static async delete(id: string): Promise<boolean> {
    // Las tecnologías y el contenido caen solos por el ON DELETE CASCADE
    const result = deleteJob.run(id)

    return result.changes > 0
  }

  // Actualizar un job
  static async update(id: string, input: UpdateJobDTO): Promise<Job | null> {
    // La lectura va dentro de la transacción: si se leyera fuera, dos PATCH
    // simultáneos sobre el mismo job partirían del mismo estado y el segundo
    // pisaría los cambios del primero
    const update = db.transaction((): Job | null => {
      const job = findById(id)

      if (!job) return null

      // El PATCH solo trae los campos que cambian, así que se parte del job actual
      const next: Job = { ...job, ...input, id }

      updateJob.run({
        id: next.id,
        title: next.title,
        company: next.company,
        location: next.location,
        description: next.description,
        modality: next.data.modality,
        level: next.data.level,
      })

      // La colección se reemplaza entera en vez de calcular altas y bajas: con
      // listas de este tamaño el diff no compensa
      writeTechnologies(next.id, next.data.technology)
      writeContent(next.id, next.content)

      return next
    })

    return update()
  }
}

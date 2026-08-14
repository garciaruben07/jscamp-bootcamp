// ================================
// ESQUEMA Y DATOS INICIALES
// ================================

import crypto from 'node:crypto'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { db } from './database'
import type { JobContent, JobData } from '../types'

// ================================
// FORMA DE LOS DATOS EN jobs.json
// ================================

// El JSON guarda la modalidad, el nivel y las tecnologías en la raíz del job,
// mientras que la API los expone dentro de `data`
interface SeedJob {
  id: string
  title: string
  company: string
  location: string
  description: string
  modality: JobData['modality']
  level: JobData['level']
  technologies: string[]
  content: JobContent
}

// ================================
// CREAR LAS TABLAS
// ================================

function createTables(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS jobs (
      id          TEXT PRIMARY KEY,
      title       TEXT NOT NULL,
      company     TEXT NOT NULL,
      location    TEXT NOT NULL,
      description TEXT NOT NULL,
      modality    TEXT NOT NULL CHECK (modality IN ('remote', 'onsite', 'hybrid')),
      level       TEXT NOT NULL CHECK (level IN ('junior', 'mid', 'senior'))
    );

    CREATE TABLE IF NOT EXISTS job_technologies (
      job_id     TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
      technology TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS job_content (
      id               TEXT PRIMARY KEY,
      job_id           TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
      description      TEXT NOT NULL,
      responsibilities TEXT NOT NULL,
      requirements     TEXT NOT NULL,
      about            TEXT NOT NULL
    );
  `)
}

// ================================
// INSERTAR LOS DATOS
// ================================

function seedJobs(jobs: SeedJob[]): void {
  const insertJob = db.prepare(`
    INSERT INTO jobs (id, title, company, location, description, modality, level)
    VALUES (@id, @title, @company, @location, @description, @modality, @level)
  `)

  const insertTechnology = db.prepare(`
    INSERT INTO job_technologies (job_id, technology)
    VALUES (?, ?)
  `)

  const insertContent = db.prepare(`
    INSERT INTO job_content (id, job_id, description, responsibilities, requirements, about)
    VALUES (@id, @jobId, @description, @responsibilities, @requirements, @about)
  `)

  // El seed deja la base de datos en su estado inicial, así que primero vacía
  // la tabla de jobs: el ON DELETE CASCADE se lleva por delante las otras dos
  const seed = db.transaction((jobsToInsert: SeedJob[]) => {
    db.prepare('DELETE FROM jobs').run()

    jobsToInsert.forEach((job) => {
      insertJob.run({
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        description: job.description,
        modality: job.modality,
        level: job.level,
      })

      job.technologies.forEach((technology) => {
        insertTechnology.run(job.id, technology)
      })

      insertContent.run({
        id: crypto.randomUUID(),
        jobId: job.id,
        description: job.content.description,
        responsibilities: job.content.responsibilities,
        requirements: job.content.requirements,
        about: job.content.about,
      })
    })
  })

  seed(jobs)
}

// ================================
// EJECUCIÓN
// ================================

const jobsPath = fileURLToPath(new URL('../jobs.json', import.meta.url))
const jobs: SeedJob[] = JSON.parse(readFileSync(jobsPath, 'utf-8'))

createTables()
console.log('Tablas creadas: jobs, job_technologies, job_content')

seedJobs(jobs)
console.log(`Datos insertados: ${jobs.length} jobs`)

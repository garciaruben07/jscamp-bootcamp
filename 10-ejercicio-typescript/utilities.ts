/* En este ejercicio deberás tipar las funciones con los tipos ya creados, y usar `Partial` y `Readonly` en cada caso. */

import type { Job } from './objects.ts'

/* Partial hace opcionales todas las propiedades de Job, así se puede actualizar solo lo que cambia */
export function updateJob(job: Job, updates: Partial<Job>): Job {
  return { ...job, ...updates }
}

/* Pick se queda solo con las cuatro propiedades del resumen */
export type JobSummary = Pick<Job, 'id' | 'title' | 'company' | 'location'>

export function getJobSummaries(jobs: Job[]): JobSummary[] {
  return jobs.map((job) => ({
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
  }))
}

/* Readonly marca todas las propiedades como inmutables */
export type ReadonlyJob = Readonly<Job>

export function displayJob(job: ReadonlyJob): void {
  console.log(`${job.title} - ${job.company}`)
  /* Aquí había un job.title = 'Nuevo título' que TypeScript rechaza al ser Readonly:
     una función que solo muestra datos no debe modificarlos */
}

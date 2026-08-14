import type { Request, Response } from 'express'
import { JobModel } from '../models/job'
import type { JobFilters } from '../types'

export class JobController {
  // GET /jobs
  // Query params tipados
  static async getAll(req: Request<{}, {}, {}, JobFilters>, res: Response): Promise<void> {
    const { tech, modality, level } = req.query

    // 1. Pasamos los valores a números
    const requestedLimit = Number(req.query.limit)
    const requestedOffset = Number(req.query.offset)

    // 2. Definimos los valores por defecto (lo mismo que en `models/job.ts`): Podemos usar variables globales
    const defaultLimit = 10
    const maxLimit = 100

    // 3. Evitamos que el usuario pase NaN, Infinity, -Infinity, y si sea un número entero mayor a 0.
    const limit = Number.isInteger(requestedLimit) && requestedLimit > 0
      ? Math.min(requestedLimit, maxLimit)
      : defaultLimit

    const offset = Number.isInteger(requestedOffset) && requestedOffset >= 0
      ? requestedOffset
      : 0

    const jobs = await JobModel.getAll({ tech, modality, level, limit, offset })
    res.json(jobs)
  }

  // GET /jobs/:id
  // Params tipados
  static async getById(req: Request<{ id: string }>, res: Response): Promise<void> {
    const { id } = req.params
    const job = await JobModel.getById(id)

    if (!job) {
      res.status(404).json({ message: 'Job not found' })
      return
    }

    res.json(job)
  }

  // POST /jobs
  // El body ya viene validado por el middleware
  static async create(req: Request, res: Response): Promise<void> {
    const newJob = await JobModel.create(req.body)
    res.status(201).json(newJob)
  }

  // PATCH /jobs/:id
  static async update(req: Request<{ id: string }>, res: Response): Promise<void> {
    const { id } = req.params
    const updatedJob = await JobModel.update(id, req.body)

    if (!updatedJob) {
      res.status(404).json({ message: 'Job not found' })
      return
    }

    res.json(updatedJob)
  }

  // DELETE /jobs/:id
  static async delete(req: Request<{ id: string }>, res: Response): Promise<void> {
    const { id } = req.params
    const deleted = await JobModel.delete(id)

    if (!deleted) {
      res.status(404).json({ message: 'Job not found' })
      return
    }

    res.status(204).send()
  }
}

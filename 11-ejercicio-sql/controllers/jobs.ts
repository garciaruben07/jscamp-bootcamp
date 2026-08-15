import type { Request, Response } from 'express'
import { PAGINATION } from '../config'
import { JobModel } from '../models/job'
import type { JobQuery } from '../types'

export class JobController {
  // GET /jobs
  // Query params tipados
  static async getAll(req: Request<{}, {}, {}, JobQuery>, res: Response): Promise<void> {
    const { tech, modality, level } = req.query

    // Los query params llegan como texto, así que hay que convertirlos
    const requestedLimit = Number(req.query.limit)
    const requestedOffset = Number(req.query.offset)

    // Number.isInteger descarta de una vez NaN, Infinity y los decimales: un `?limit=abc`
    // o un `?limit=-5` caen al valor por defecto en lugar de llegar a la consulta.
    // El techo evita que una sola petición se lleve la tabla entera
    const limit = Number.isInteger(requestedLimit) && requestedLimit > 0
      ? Math.min(requestedLimit, PAGINATION.maxLimit)
      : PAGINATION.defaultLimit

    const offset = Number.isInteger(requestedOffset) && requestedOffset >= 0
      ? requestedOffset
      : PAGINATION.defaultOffset

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

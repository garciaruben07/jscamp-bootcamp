import { Router } from 'express'
import { JobController } from '../controllers/jobs.js'

export const jobsRouter = Router()

/* Las rutas son relativas al prefijo con el que se monta el router en app.js */
jobsRouter.get('/', JobController.getAll)

import express from 'express'
import { jobsRouter } from './routes/jobs.js'
import { DEFAULTS } from './config.js'

const app = express()

/* Parsea el cuerpo JSON de las peticiones y lo deja en req.body */
app.use(express.json())

app.use('/jobs', jobsRouter)

app.listen(DEFAULTS.PORT, () => {
  console.log(`Servidor levantado en http://localhost:${DEFAULTS.PORT}`)
})

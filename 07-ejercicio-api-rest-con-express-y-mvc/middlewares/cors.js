import cors from 'cors'

const ORIGENES_ACEPTADOS = [
  'http://localhost:3000',
  'http://localhost:1234',
  'https://midu.dev',
  'http://jscamp.dev',
  'http://localhost:5173',
]

export const corsMiddleware = ({ acceptedOrigins = ORIGENES_ACEPTADOS } = {}) =>
  cors({
    origin: (origin, callback) => {
      if (acceptedOrigins.includes(origin)) return callback(null, true)

      /* Las peticiones que no son de navegador (curl, Postman) llegan sin origin */
      if (origin === undefined) return callback(null, true)

      return callback(new Error('Origen no permitido por CORS'))
    },
  })

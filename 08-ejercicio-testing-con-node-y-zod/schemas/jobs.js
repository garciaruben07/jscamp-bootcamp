import { z } from 'zod'

const jobSchema = z.object({
  titulo: z
    .string({ message: 'El título debe ser un texto' })
    .min(3, { message: 'El título debe tener al menos 3 caracteres' })
    .max(100, { message: 'El título no puede superar los 100 caracteres' }),
  empresa: z.string({ message: 'La empresa debe ser un texto' }),
  ubicacion: z.string({ message: 'La ubicación debe ser un texto' }),
  descripcion: z.string({ message: 'La descripción debe ser un texto' }).optional(),
  data: z
    .object({
      technology: z.array(z.string(), { message: 'Las tecnologías deben ser un array de textos' }),
      modalidad: z.string().optional(),
      nivel: z.string().optional(),
    })
    .optional(),
  content: z
    .object({
      description: z.string().optional(),
      responsibilities: z.string().optional(),
      requirements: z.string().optional(),
      about: z.string().optional(),
    })
    .optional(),
})

/* safeParse no lanza: devuelve { success, data } o { success, error } y decide quien llama */
export function validateJob(input) {
  return jobSchema.safeParse(input)
}

/* partial() convierte todos los campos en opcionales, que es justo lo que necesita un PATCH */
export function validatePartialJob(input) {
  return jobSchema.partial().safeParse(input)
}

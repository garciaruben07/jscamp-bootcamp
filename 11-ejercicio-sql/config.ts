export const PORT = process.env.PORT ?? 3000

/* Los valores de la paginación viven aquí y no repartidos entre el controlador y el
   modelo: si el límite por defecto cambiara solo en uno de los dos, la API respondería
   una cosa distinta según por dónde entrara la llamada */
export const PAGINATION = {
  defaultLimit: 10,
  maxLimit: 100,
  defaultOffset: 0,
} as const

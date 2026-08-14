// ================================
// CONEXIÓN A SQLITE
// ================================

import Database from 'better-sqlite3'
import { fileURLToPath } from 'node:url'

// La ruta se resuelve a partir de este fichero y no del directorio desde el
// que se lance el proceso, así el seed y el servidor abren siempre el mismo archivo
const DB_PATH = fileURLToPath(new URL('../jobs.db', import.meta.url))

export const db = new Database(DB_PATH)

// Write-Ahead Logging: las lecturas no bloquean a las escrituras
db.pragma('journal_mode = WAL')

// SQLite no aplica las claves foráneas si no se activan en cada conexión
db.pragma('foreign_keys = ON')

// El seed y el servidor son dos conexiones sobre el mismo fichero: sin esto, una
// escritura concurrente falla al instante con SQLITE_BUSY en vez de esperar
db.pragma('busy_timeout = 5000')

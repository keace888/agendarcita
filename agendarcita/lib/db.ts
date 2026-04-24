import { Pool } from 'pg'

const globalForPg = global as unknown as { agendaPool: Pool }

const isNeon = process.env.DATABASE_URL?.includes('neon.tech')

const pool =
  globalForPg.agendaPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isNeon ? { rejectUnauthorized: false } : false,
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPg.agendaPool = pool
}

export default pool

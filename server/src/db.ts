/**
 * SQLite storage for bookings, using Node's built-in `node:sqlite` (no native
 * dependency). The DB is a single file — back it up by copying it.
 */
import { DatabaseSync } from 'node:sqlite'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
// Store the DB file at server/bookings.db (gitignored).
const DB_PATH = process.env.BOOKINGS_DB ?? join(__dirname, '..', 'bookings.db')

const db = new DatabaseSync(DB_PATH)

db.exec(`
  CREATE TABLE IF NOT EXISTS bookings (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    start      TEXT NOT NULL UNIQUE,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL,
    phone      TEXT,
    note       TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`)

export type Booking = {
  id: number
  start: string
  name: string
  email: string
  phone: string | null
  note: string | null
  created_at: string
}

export type NewBooking = {
  start: string
  name: string
  email: string
  phone?: string
  note?: string
}

/** ISO starts of all bookings (used to exclude taken slots). */
export function bookedStarts(): Set<string> {
  const rows = db.prepare('SELECT start FROM bookings').all() as { start: string }[]
  return new Set(rows.map((r) => r.start))
}

/**
 * Insert a booking. Returns the row, or null if the slot was already taken
 * (UNIQUE(start) violation) — the caller should treat null as a 409 conflict.
 */
export function insertBooking(b: NewBooking): Booking | null {
  try {
    const info = db
      .prepare('INSERT INTO bookings (start, name, email, phone, note) VALUES (?, ?, ?, ?, ?)')
      .run(b.start, b.name, b.email, b.phone ?? null, b.note ?? null)
    return db
      .prepare('SELECT * FROM bookings WHERE id = ?')
      .get(info.lastInsertRowid as number) as Booking
  } catch (err) {
    if (err instanceof Error && /UNIQUE/i.test(err.message)) return null
    throw err
  }
}

export function allBookings(): Booking[] {
  return db.prepare('SELECT * FROM bookings ORDER BY start ASC').all() as Booking[]
}

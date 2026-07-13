/**
 * NickBuilds booking API (Express + node:sqlite).
 *
 *   GET  /api/health         → { ok }
 *   GET  /api/availability   → { slots: Slot[] }
 *   POST /api/book           → { ok, booking } | 409 if slot taken | 400 invalid
 *
 * Run in dev:  npm run dev:api   (or npm run dev:all for web + api)
 * The Vite dev server proxies /api → this server (see vite.config.ts).
 */
import express from 'express'
import { generateSlots, isSlotAvailable } from './availability.ts'
import { bookedStarts, insertBooking } from './db.ts'
import { emailSender } from './email.ts'

const app = express()
app.use(express.json())

const PORT = Number(process.env.PORT ?? 8787)

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.get('/api/availability', (_req, res) => {
  const slots = generateSlots(bookedStarts())
  res.json({ slots })
})

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

app.post('/api/book', async (req, res) => {
  const body = (req.body ?? {}) as Record<string, unknown>
  const start = typeof body.start === 'string' ? body.start : ''
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const phone = typeof body.phone === 'string' ? body.phone.trim() : undefined
  const note = typeof body.note === 'string' ? body.note.trim() : undefined

  // Honeypot: real clients never fill `company`.
  if (typeof body.company === 'string' && body.company.length > 0) {
    return res.status(200).json({ ok: true }) // silently accept, don't store
  }

  if (!start || !name || !isEmail(email)) {
    return res.status(400).json({ ok: false, error: 'Missing or invalid name, email, or slot.' })
  }

  const booked = bookedStarts()
  if (!isSlotAvailable(start, booked)) {
    return res.status(409).json({ ok: false, error: 'That slot is no longer available.' })
  }

  const booking = insertBooking({ start, name, email, phone, note })
  if (!booking) {
    return res.status(409).json({ ok: false, error: 'That slot was just taken.' })
  }

  // Fire-and-log; email failure must not fail the booking.
  emailSender.send(booking).catch((err) => console.error('[email] failed:', err))

  res.status(201).json({ ok: true, booking: { start: booking.start } })
})

app.listen(PORT, () => {
  console.log(`Booking API listening on http://localhost:${PORT}`)
})

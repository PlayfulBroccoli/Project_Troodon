/**
 * Client for the booking API (served under /api — proxied to the booking server
 * in dev, same-origin in production).
 */

export type Slot = {
  start: string // ISO instant — the slot id
  date: string // YYYY-MM-DD
  dateLabel: string // e.g. "Mon, 14 Jul"
  time: string // HH:MM local
}

export type DayGroup = {
  date: string
  dateLabel: string
  slots: Slot[]
}

/** Fetch open slots, grouped by day in chronological order. */
export async function fetchAvailability(): Promise<DayGroup[]> {
  const res = await fetch('/api/availability')
  if (!res.ok) throw new Error('Could not load availability')
  const { slots } = (await res.json()) as { slots: Slot[] }

  const groups: DayGroup[] = []
  const byDate = new Map<string, DayGroup>()
  for (const s of slots) {
    let g = byDate.get(s.date)
    if (!g) {
      g = { date: s.date, dateLabel: s.dateLabel, slots: [] }
      byDate.set(s.date, g)
      groups.push(g)
    }
    g.slots.push(s)
  }
  return groups
}

export type BookingInput = {
  start: string
  name: string
  email: string
  phone?: string
  note?: string
  company?: string // honeypot — leave empty
}

/** Create a booking. Throws with a user-facing message on failure. */
export async function createBooking(input: BookingInput): Promise<void> {
  const res = await fetch('/api/book', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string }
  if (!res.ok || !data.ok) {
    throw new Error(data.error || 'Something went wrong. Please try again.')
  }
}

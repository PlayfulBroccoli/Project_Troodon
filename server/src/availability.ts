/**
 * Availability model for the booking flow.
 *
 * Edit `bookingConfig` to set your real hours. Times are wall-clock in the
 * configured timezone offset. Kuala Lumpur is a fixed UTC+08:00 with no daylight
 * saving, so a fixed offset is exact — if you move to a DST timezone, switch to a
 * proper tz library (luxon) instead of a fixed offset.
 */

export const bookingConfig = {
  /** Fixed UTC offset for your local wall-clock times, e.g. "+08:00". */
  utcOffset: '+08:00',
  /** For labelling only. */
  timezoneLabel: 'Asia/Kuala_Lumpur (GMT+8)',
  /** Length of each bookable slot, in minutes. */
  slotMinutes: 20,
  /** How many days ahead people can book. */
  daysAhead: 14,
  /** Minimum notice before a slot can be booked, in hours. */
  minLeadHours: 12,
  /**
   * Weekly availability windows, keyed by weekday (0=Sun … 6=Sat).
   * Each window is [startHHMM, endHHMM] in local wall-clock time.
   */
  weekly: {
    1: [['10:00', '12:00'], ['14:00', '17:00']],
    2: [['10:00', '12:00'], ['14:00', '17:00']],
    3: [['10:00', '12:00'], ['14:00', '17:00']],
    4: [['10:00', '12:00'], ['14:00', '17:00']],
    5: [['10:00', '12:00']],
  } as Record<number, [string, string][]>,
}

export type Slot = {
  /** ISO 8601 instant (UTC) — the canonical id for a slot/booking. */
  start: string
  /** Local date, YYYY-MM-DD. */
  date: string
  /** Friendly date label, e.g. "Mon, 14 Jul". */
  dateLabel: string
  /** Local time, HH:MM. */
  time: string
}

const pad = (n: number) => String(n).padStart(2, '0')
const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

function offsetMs(offset: string): number {
  const m = /^([+-])(\d{2}):(\d{2})$/.exec(offset)
  if (!m) return 0
  const sign = m[1] === '-' ? -1 : 1
  return sign * (Number(m[2]) * 60 + Number(m[3])) * 60_000
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/**
 * Generate all bookable slots in the configured window, excluding any whose ISO
 * `start` appears in `booked`, and any that fall inside the minimum lead time.
 */
export function generateSlots(booked: Set<string>, now: number = Date.now()): Slot[] {
  const off = offsetMs(bookingConfig.utcOffset)
  const leadCutoff = now + bookingConfig.minLeadHours * 3_600_000

  // "Today" in local wall-clock terms.
  const localNow = new Date(now + off)
  const y0 = localNow.getUTCFullYear()
  const m0 = localNow.getUTCMonth()
  const d0 = localNow.getUTCDate()

  const slots: Slot[] = []

  for (let i = 0; i <= bookingConfig.daysAhead; i++) {
    const day = new Date(Date.UTC(y0, m0, d0 + i))
    const weekday = day.getUTCDay()
    const windows = bookingConfig.weekly[weekday]
    if (!windows) continue

    const yy = day.getUTCFullYear()
    const mm = day.getUTCMonth()
    const dd = day.getUTCDate()
    const date = `${yy}-${pad(mm + 1)}-${pad(dd)}`
    const dateLabel = `${WEEKDAYS[weekday]}, ${dd} ${MONTHS[mm]}`

    for (const [start, end] of windows) {
      const startMin = toMinutes(start)
      const endMin = toMinutes(end)
      for (let t = startMin; t + bookingConfig.slotMinutes <= endMin; t += bookingConfig.slotMinutes) {
        const hh = Math.floor(t / 60)
        const min = t % 60
        // Local wall-clock treated as UTC, then shifted back to the real UTC instant.
        const instantMs = Date.UTC(yy, mm, dd, hh, min) - off
        if (instantMs < leadCutoff) continue
        const iso = new Date(instantMs).toISOString()
        if (booked.has(iso)) continue
        slots.push({ start: iso, date, dateLabel, time: `${pad(hh)}:${pad(min)}` })
      }
    }
  }

  return slots
}

/** True if `iso` is a currently-bookable slot (valid time, not taken, within lead). */
export function isSlotAvailable(iso: string, booked: Set<string>, now: number = Date.now()): boolean {
  return generateSlots(booked, now).some((s) => s.start === iso)
}

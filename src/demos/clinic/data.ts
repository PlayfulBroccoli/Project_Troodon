/**
 * Clinic demo config + types — the single source of truth for the brand, the
 * doctor roster, the service menu, and the appointment slot grid. Mirrors the
 * repo's config pattern (src/config/site.ts, src/demos/restaurant/data.ts): no
 * hard-coded brand strings in components, everything lives here.
 *
 * Malaysian context → RM currency (matches pricing.ts / Contact.tsx).
 */

export const clinic = {
  name: 'Klinik Sri Sentosa',
  monogram: 'SS',
  tagline: 'Family medicine, gently.',
  area: 'Taman Tun, KL',
  hours: 'Mon–Sat · 9am – 5pm',
  /** Prefilled WhatsApp message for a booking enquiry. */
  bookingMessage:
    "Hi Klinik Sri Sentosa, I'd like to book an appointment.",
}

export type Doctor = {
  id: string
  name: string
  specialty: string
  room: number
  monogram: string
  /** Accent token used for the doctor's column/dot — references a --cl-* var. */
  accent: string
}

export type Service = {
  id: string
  name: string
  durationMin: number
  fee: number
  /** The doctor this service belongs to, if any (null = any GP). */
  doctorId: string | null
}

export const doctors: Doctor[] = [
  { id: 'dr-aria', name: 'Dr. Aria Lim', specialty: 'General Practice', room: 1, monogram: 'AL', accent: 'var(--cl-primary)' },
  { id: 'dr-boon', name: 'Dr. Boon Tan', specialty: 'Paediatrics', room: 2, monogram: 'BT', accent: 'var(--cl-accent)' },
  { id: 'dr-chandra', name: 'Dr. Chandra Rao', specialty: 'Internal Medicine', room: 3, monogram: 'CR', accent: 'var(--cl-ink)' },
  { id: 'dr-dahlia', name: 'Dr. Dahlia Goh', specialty: 'Dermatology', room: 4, monogram: 'DG', accent: 'var(--cl-warn)' },
  { id: 'dr-elias', name: 'Dr. Elias Wong', specialty: 'Dental', room: 5, monogram: 'EW', accent: '#3b6b8a' },
]

export const services: Service[] = [
  { id: 'gp-consult', name: 'General consultation', durationMin: 20, fee: 60, doctorId: 'dr-aria' },
  { id: 'vax', name: 'Vaccination', durationMin: 10, fee: 45, doctorId: 'dr-aria' },
  { id: 'followup', name: 'Follow-up review', durationMin: 15, fee: 35, doctorId: null },
  { id: 'paed-consult', name: 'Paediatric consultation', durationMin: 25, fee: 80, doctorId: 'dr-boon' },
  { id: 'im-review', name: 'Internal medicine review', durationMin: 30, fee: 120, doctorId: 'dr-chandra' },
  { id: 'health-screen', name: 'Health screening', durationMin: 40, fee: 250, doctorId: 'dr-chandra' },
  { id: 'derma-consult', name: 'Dermatology consult', durationMin: 25, fee: 110, doctorId: 'dr-dahlia' },
  { id: 'dental-clean', name: 'Scaling & cleaning', durationMin: 45, fee: 180, doctorId: 'dr-elias' },
  { id: 'dental-fill', name: 'Dental filling', durationMin: 60, fee: 220, doctorId: 'dr-elias' },
]

/** Lookups used across the demo. */
export const doctorById = (id: string): Doctor | undefined =>
  doctors.find((d) => d.id === id)
export const serviceById = (id: string): Service | undefined =>
  services.find((s) => s.id === id)

/** Slot grid — 30-minute appointments across opening hours. */
const SLOT_MINUTES = 30
const OPEN_HOUR = 9
const CLOSE_HOUR = 17

export const timeSlots: string[] = (() => {
  const out: string[] = []
  for (let m = OPEN_HOUR * 60; m < CLOSE_HOUR * 60; m += SLOT_MINUTES) {
    const h = Math.floor(m / 60)
    const min = m % 60
    out.push(`${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`)
  }
  return out
})()

/**
 * Default weekday off per doctor (0 = Sunday … 6 = Saturday). The clinic is
 * closed Sundays clinic-wide; per-doctor off days are in addition. Editable
 * live from the Roster view (store.toggleDayOff).
 */
export const defaultDaysOff: Record<string, number[]> = {
  'dr-aria': [],
  'dr-boon': [3], // Wed
  'dr-chandra': [5], // Fri
  'dr-dahlia': [6], // Sat
  'dr-elias': [2], // Tue
}

export const weekdayShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/** Format a number as RM (mirrors the restaurant money() helper). */
export function money(n: number): string {
  return `RM ${n}`
}

/* ---------------- date helpers (app code — Date is fine here) ---------------- */

/** Today's calendar date as 'YYYY-MM-DD' (local). */
export function todayISO(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`
}

/** Add days to a 'YYYY-MM-DD' date, returning 'YYYY-MM-DD'. */
export function addDaysISO(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00`)
  d.setDate(d.getDate() + days)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`
}

/** Weekday index (0 = Sun … 6 = Sat) for a 'YYYY-MM-DD' date. */
export function weekdayOf(iso: string): number {
  return new Date(`${iso}T00:00:00`).getDay()
}

/** Human label for a 'YYYY-MM-DD' date, e.g. "Mon 24". */
export function dateLabel(iso: string): string {
  const d = new Date(`${iso}T00:00:00`)
  return `${weekdayShort[d.getDay()]} ${d.getDate()}`
}

/* ---------------- appointment types (shared with store.ts) ---------------- */

export type AppointmentStatus =
  | 'scheduled'
  | 'arrived'
  | 'in-room'
  | 'done'
  | 'cancelled'
  | 'no-show'

export type Appointment = {
  id: string
  patientName: string
  phone?: string
  doctorId: string
  serviceId: string
  serviceLabel: string
  /** 'YYYY-MM-DD'. */
  date: string
  /** 'HH:MM'. */
  time: string
  status: AppointmentStatus
  notes?: string
  bookedAt: number
}

/** Order of statuses on the reception board (left → right). */
export const statusOrder: AppointmentStatus[] = [
  'scheduled',
  'arrived',
  'in-room',
  'done',
]

export const statusLabel: Record<AppointmentStatus, string> = {
  scheduled: 'Scheduled',
  arrived: 'Arrived · waiting',
  'in-room': 'In room',
  done: 'Done',
  cancelled: 'Cancelled',
  'no-show': 'No-show',
}
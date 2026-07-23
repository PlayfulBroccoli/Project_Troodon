import { useSyncExternalStore } from 'react'
import {
  type Appointment,
  type AppointmentStatus,
  defaultDaysOff,
  timeSlots,
  todayISO,
  weekdayOf,
} from './data'

/**
 * Clinic store — the one piece of shared state in the demo, backing the public
 * booking flow, the receptionist board, and the doctor roster. No backend:
 * state lives in localStorage (shared across same-origin tabs) and changes are
 * broadcast via BroadcastChannel so a booking made in one tab lands on the
 * reception board in another in real time. For a real deploy you'd swap this
 * one module for a tiny API + websocket.
 *
 * Two sides read/write the same state:
 *  - Patient (booking): creates 'scheduled' appointments.
 *  - Staff (reception): checks patients in, calls them into the room, completes
 *    the visit, marks no-shows. Roster toggles a doctor's day off, which
 *    removes their slots from the public booking availability.
 * Seeded with a realistic day in progress so a public visitor sees a living
 * clinic; real bookings during a demo merge in live.
 */

export type ClinicState = {
  appointments: Appointment[]
  /** Weekday off per doctor (0 = Sun … 6 = Sat). */
  daysOff: Record<string, number[]>
}

const KEY = 'klinik-sentosa-v1'
const CHANNEL = 'klinik-sentosa'

let channel: BroadcastChannel | null = null
try {
  channel = new BroadcastChannel(CHANNEL)
} catch {
  channel = null // BroadcastChannel unavailable (older browser / SSR) — boards still work locally.
}

let cache: ClinicState | null = null
const listeners = new Set<() => void>()

/* ---------------- seed ---------------- */

// (Math.random / Date are fine here — app code, not a workflow script.)

function seed(): ClinicState {
  const today = todayISO()
  const now = Date.now()
  const mk = (
    id: string,
    patientName: string,
    doctorId: string,
    serviceId: string,
    serviceLabel: string,
    time: string,
    status: AppointmentStatus,
    notes?: string,
  ): Appointment => ({
    id,
    patientName,
    doctorId,
    serviceId,
    serviceLabel,
    date: today,
    time,
    status,
    notes,
    bookedAt: now,
    phone: '012-345 6789',
  })

  const appointments: Appointment[] = [
    mk('ap-301', 'Puan Halimah', 'dr-aria', 'gp-consult', 'General consultation', '09:00', 'done'),
    mk('ap-302', 'En. Suresh', 'dr-aria', 'vax', 'Vaccination', '09:30', 'done'),
    mk('ap-303', 'Aisha (f, 6)', 'dr-boon', 'paed-consult', 'Paediatric consultation', '10:00', 'arrived', 'Fever, 2 days'),
    mk('ap-304', 'Mdm. Lee', 'dr-chandra', 'im-review', 'Internal medicine review', '10:30', 'in-room', 'BP follow-up'),
    mk('ap-305', 'Mr. Tan', 'dr-dahlia', 'derma-consult', 'Dermatology consult', '09:00', 'done'),
    mk('ap-306', 'Cik Nurul', 'dr-elias', 'dental-clean', 'Scaling & cleaning', '11:00', 'scheduled'),
    mk('ap-307', 'En. Faiz', 'dr-aria', 'followup', 'Follow-up review', '11:30', 'scheduled'),
    mk('ap-308', 'Baby Arif', 'dr-boon', 'paed-consult', 'Paediatric consultation', '14:00', 'scheduled', '2-month jabs'),
    mk('ap-309', 'Mr. Goh', 'dr-chandra', 'health-screen', 'Health screening', '14:30', 'scheduled'),
    mk('ap-310', 'Ms. Priya', 'dr-dahlia', 'derma-consult', 'Dermatology consult', '15:00', 'scheduled'),
    mk('ap-311', 'En. Hafiz', 'dr-elias', 'dental-fill', 'Dental filling', '15:30', 'scheduled'),
    mk('ap-312', 'Mdm. Chong', 'dr-aria', 'gp-consult', 'General consultation', '10:00', 'no-show'),
    mk('ap-313', 'Cik Lina', 'dr-boon', 'followup', 'Follow-up review', '16:30', 'scheduled'),
  ]

  return { appointments, daysOff: structuredClone(defaultDaysOff) }
}

/* ---------------- low-level ---------------- */

function read(): ClinicState {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as ClinicState
      if (parsed && Array.isArray(parsed.appointments) && parsed.daysOff) return parsed
    }
  } catch {
    /* fall through to seed */
  }
  const s = seed()
  try {
    localStorage.setItem(KEY, JSON.stringify(s))
  } catch {
    /* ignore quota / privacy mode */
  }
  return s
}

function getSnapshot(): ClinicState {
  if (cache === null) cache = read()
  return cache
}

function commit(next: ClinicState) {
  cache = next
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l())
  channel?.postMessage('changed')
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb)
  const onMsg = () => {
    cache = read() // re-read the shared storage another tab wrote
    cb()
  }
  channel?.addEventListener('message', onMsg)
  window.addEventListener('storage', onMsg)
  return () => {
    listeners.delete(cb)
    channel?.removeEventListener('message', onMsg)
    window.removeEventListener('storage', onMsg)
  }
}

/* ---------------- public API: read ---------------- */

export function useClinic(): ClinicState {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

/* ---------------- public API: availability ---------------- */

/** Is this doctor's weekday marked off (or a clinic-wide Sunday close)? */
export function isDoctorOff(state: ClinicState, doctorId: string, iso: string): boolean {
  const wd = weekdayOf(iso)
  if (wd === 0) return true // clinic closed Sundays
  return (state.daysOff[doctorId] ?? []).includes(wd)
}

/** Is a specific slot already booked (not cancelled) for this doctor + date? */
export function isSlotTaken(
  state: ClinicState,
  doctorId: string,
  iso: string,
  time: string,
): boolean {
  return state.appointments.some(
    (a) =>
      a.doctorId === doctorId &&
      a.date === iso &&
      a.time === time &&
      a.status !== 'cancelled',
  )
}

/** Free slots for a doctor on a date (full grid minus booked minus day-off). */
export function availableSlots(
  state: ClinicState,
  doctorId: string,
  iso: string,
): string[] {
  if (isDoctorOff(state, doctorId, iso)) return []
  return timeSlots.filter((t) => !isSlotTaken(state, doctorId, iso, t))
}

/* ---------------- public API: appointments ---------------- */

export function bookAppointment(
  input: Omit<Appointment, 'id' | 'status' | 'bookedAt'>,
): Appointment {
  const state = getSnapshot()
  const full: Appointment = {
    ...input,
    id: `ap-${Math.floor(Math.random() * 9000) + 3200}`,
    status: 'scheduled',
    bookedAt: Date.now(),
  }
  commit({ ...state, appointments: [full, ...state.appointments] })
  return full
}

export function setStatus(id: string, status: AppointmentStatus) {
  const state = getSnapshot()
  commit({
    ...state,
    appointments: state.appointments.map((a) => (a.id === id ? { ...a, status } : a)),
  })
}

/** Reception: patient walked in → scheduled becomes arrived (waiting). */
export function checkIn(id: string) {
  setStatus(id, 'arrived')
}

/** Reception: call the waiting patient into the room → arrived becomes in-room. */
export function callIn(id: string) {
  setStatus(id, 'in-room')
}

/** Reception: visit finished → in-room becomes done. */
export function complete(id: string) {
  setStatus(id, 'done')
}

/** Reception: patient didn't show → scheduled becomes no-show. */
export function noShow(id: string) {
  setStatus(id, 'no-show')
}

/** Reception / patient: cancel a scheduled appointment. */
export function cancel(id: string) {
  setStatus(id, 'cancelled')
}

/* ---------------- public API: roster ---------------- */

export function toggleDayOff(doctorId: string, weekday: number) {
  const state = getSnapshot()
  const current = state.daysOff[doctorId] ?? []
  const has = current.includes(weekday)
  const next = has ? current.filter((w) => w !== weekday) : [...current, weekday]
  commit({ ...state, daysOff: { ...state.daysOff, [doctorId]: next } })
}

/* ---------------- demo ---------------- */

export function resetDemo() {
  commit(seed())
}
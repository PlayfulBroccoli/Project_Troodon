import { useState } from 'react'
import { Link } from 'react-router-dom'
import { whatsappLink } from '../../config/site'
import {
  clinic,
  doctors,
  services,
  money,
  doctorById,
  serviceById,
  todayISO,
  addDaysISO,
  dateLabel,
  weekdayOf,
  weekdayShort,
  type Appointment,
} from './data'
import {
  useClinic,
  bookAppointment,
  availableSlots,
  isDoctorOff,
} from './store'
import {
  CalendarIcon,
  ClockIcon,
  ArrowRightIcon,
  CheckIcon,
  StethoscopeIcon,
} from './icons'
import './clinic.css'

/**
 * Patient booking flow — the demo's centrepiece. A calm, linear four-step form:
 * service → doctor → date + slot → your details. Submitting does two things:
 * hands the booking to WhatsApp (no backend, matches the studio's Contact flow)
 * AND writes the appointment into the live store, so it lands on the reception
 * board in real time across tabs. Slot availability is read live from the store,
 * so two patient tabs can't double-book the same slot.
 */
export function Booking() {
  const state = useClinic()

  const [step, setStep] = useState(1)
  const [serviceId, setServiceId] = useState<string | null>(null)
  const [doctorId, setDoctorId] = useState<string | null>(null)
  const [date, setDate] = useState<string | null>(null)
  const [time, setTime] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [booked, setBooked] = useState<Appointment | null>(null)

  const service = serviceId ? serviceById(serviceId) : undefined
  const doctor = doctorId ? doctorById(doctorId) : undefined

  /** Doctors eligible for the chosen service. */
  const eligibleDoctors = service
    ? service.doctorId
      ? doctors.filter((d) => d.id === service.doctorId)
      : doctors
    : []

  /** Next 7 working days (skip Sundays — clinic closed). */
  const dateChips: string[] = (() => {
    const out: string[] = []
    let iso = todayISO()
    while (out.length < 7) {
      if (weekdayOf(iso) !== 0) out.push(iso)
      iso = addDaysISO(iso, 1)
    }
    return out
  })()

  const slots = doctorId && date ? availableSlots(state, doctorId, date) : []
  const doctorOffToday = doctorId && date ? isDoctorOff(state, doctorId, date) : false

  const reset = () => {
    setStep(1)
    setServiceId(null)
    setDoctorId(null)
    setDate(null)
    setTime(null)
    setName('')
    setPhone('')
    setNotes('')
    setBooked(null)
  }

  const pickService = (id: string) => {
    setServiceId(id)
    setDoctorId(null)
    setDate(null)
    setTime(null)
    setStep(2)
  }

  const pickDoctor = (id: string) => {
    setDoctorId(id)
    setDate(null)
    setTime(null)
    setStep(3)
  }

  const confirm = () => {
    if (!service || !doctor || !date || !time || !name.trim()) return
    const summary = [
      `Hi ${clinic.name}, I'd like to book:`,
      `- Service: ${service.name}`,
      `- Doctor: ${doctor.name}`,
      `- Date: ${dateLabel(date)}`,
      `- Time: ${time}`,
      `- Name: ${name}`,
      phone ? `- Phone: ${phone}` : null,
      notes ? `- Notes: ${notes}` : null,
    ]
      .filter(Boolean)
      .join('\n')

    const appt = bookAppointment({
      patientName: name.trim(),
      phone: phone.trim() || undefined,
      doctorId: doctor.id,
      serviceId: service.id,
      serviceLabel: service.name,
      date,
      time,
      notes: notes.trim() || undefined,
    })

    window.open(whatsappLink(summary), '_blank', 'noopener,noreferrer')
    setBooked(appt)
  }

  /* ---------------- success modal ---------------- */
  if (booked) {
    return (
      <>
        <BookingHeader />
        <div className="cl-overlay">
          <div className="cl-pop">
            <span className="cl-monogram mx-auto mb-5 h-14 w-14 text-lg" style={{ background: 'var(--cl-accent)' }}>
              <CheckIcon width={26} height={26} />
            </span>
            <div className="cl-eyebrow mb-2">Booked</div>
            <h2 className="cl-display text-3xl text-[var(--cl-ink)]">{booked.time}</h2>
            <p className="cl-serif mt-1 text-xl text-[var(--cl-ink-soft)]">{dateLabel(booked.date)}</p>
            <div className="cl-mono mt-5 space-y-1 text-sm text-[var(--cl-ink-soft)]">
              <div>{booked.serviceLabel}</div>
              <div>{doctorById(booked.doctorId)?.name} · Room {doctorById(booked.doctorId)?.room}</div>
              <div>{booked.patientName}</div>
            </div>
            <p className="mt-5 text-sm text-[var(--cl-ink-soft)]">
              We've sent the details to WhatsApp — and the appointment is now on the reception board.
            </p>
            <div className="mt-7 flex flex-col gap-2.5">
              <Link to="/demos/clinic/reception" className="cl-btn cl-btn--solid w-full">
                See it on the reception board <ArrowRightIcon width={16} height={16} />
              </Link>
              <button type="button" onClick={reset} className="cl-btn cl-btn--ghost w-full">
                Book another
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }

  /* ---------------- stepped form ---------------- */
  return (
    <>
      <BookingHeader />
      <section className="mx-auto max-w-2xl px-6 py-10 lg:px-8">
        <div className="cl-rise mb-8">
          <div className="cl-eyebrow mb-3">Book appointment</div>
          <h1 className="cl-display text-4xl text-[var(--cl-ink)] sm:text-5xl">Pick a time</h1>
          <p className="cl-serif mt-2 text-xl text-[var(--cl-ink-soft)]">
            Four quick steps. Free slots are live.
          </p>
        </div>

        {/* Progress */}
        <ol className="cl-mono mb-8 flex items-center gap-2 text-[11px] uppercase tracking-widest">
          {['Service', 'Doctor', 'Time', 'Details'].map((label, i) => {
            const n = i + 1
            const done = n < step
            const current = n === step
            return (
              <li key={label} className="flex items-center gap-2">
                <span
                  className={`inline-grid h-6 w-6 place-items-center rounded-full border ${
                    current
                      ? 'border-[var(--cl-primary)] bg-[var(--cl-primary)] text-white'
                      : done
                        ? 'border-[var(--cl-accent)] bg-[var(--cl-accent)] text-white'
                        : 'border-[var(--cl-line)] text-[var(--cl-ink-soft)]'
                  }`}
                >
                  {done ? <CheckIcon width={12} height={12} /> : n}
                </span>
                <span className={current ? 'text-[var(--cl-ink)]' : 'text-[var(--cl-ink-soft)]'}>{label}</span>
                {n < 4 && <span className="mx-1 text-[var(--cl-line)]">—</span>}
              </li>
            )
          })}
        </ol>

        <div className="cl-card p-6 sm:p-7">
          {/* Step 1 — service */}
          {step === 1 && (
            <div>
              <StepHead n={1} title="What do you need?" />
              <div className="mt-5 space-y-2.5">
                {services.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => pickService(s.id)}
                    className="flex w-full items-center gap-4 rounded-lg border border-[var(--cl-line)] p-4 text-left transition hover:border-[var(--cl-primary)] hover:bg-[var(--cl-surface-2)]"
                  >
                    <StethoscopeIcon width={20} height={20} className="text-[var(--cl-ink-soft)]" />
                    <div className="flex-1">
                      <div className="cl-display text-lg text-[var(--cl-ink)]">{s.name}</div>
                      <div className="cl-mono text-xs text-[var(--cl-ink-soft)]">
                        <ClockIcon width={12} height={12} className="inline -mt-0.5" /> {s.durationMin} min
                        {s.doctorId && <> · {doctorById(s.doctorId)?.name}</>}
                      </div>
                    </div>
                    <span className="cl-display text-lg text-[var(--cl-primary)]">{money(s.fee)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2 — doctor */}
          {step === 2 && (
            <div>
              <StepHead n={2} title="Who would you like to see?" />
              <div className="mt-5 space-y-2.5">
                {eligibleDoctors.map((d) => {
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => pickDoctor(d.id)}
                      className="flex w-full items-center gap-4 rounded-lg border border-[var(--cl-line)] p-4 text-left transition hover:border-[var(--cl-primary)] hover:bg-[var(--cl-surface-2)]"
                    >
                      <span className="cl-monogram h-11 w-11 text-sm" style={{ background: d.accent }}>
                        {d.monogram}
                      </span>
                      <div className="flex-1">
                        <div className="cl-display text-lg text-[var(--cl-ink)]">{d.name}</div>
                        <div className="cl-mono text-xs text-[var(--cl-ink-soft)]">{d.specialty} · Room {d.room}</div>
                      </div>
                      <ArrowRightIcon width={18} height={18} className="text-[var(--cl-ink-soft)]" />
                    </button>
                  )
                })}
              </div>
              <BackBtn onClick={() => setStep(1)} />
            </div>
          )}

          {/* Step 3 — date + slot */}
          {step === 3 && (
            <div>
              <StepHead n={3} title="Pick a day and time" />
              <div className="cl-label mt-5">Day</div>
              <div className="flex flex-wrap gap-2">
                {dateChips.map((iso) => (
                  <button
                    key={iso}
                    type="button"
                    onClick={() => { setDate(iso); setTime(null) }}
                    className={`cl-chip ${date === iso ? 'cl-chip--on' : ''}`}
                  >
                    {dateLabel(iso)}
                  </button>
                ))}
              </div>

              {date && (
                <>
                  <div className="cl-label mt-6">Time</div>
                  {doctorOffToday ? (
                    <p className="cl-serif text-[var(--cl-ink-soft)]">
                      {doctor?.name} is off on {weekdayShort[weekdayOf(date)]}. Try another doctor or day.
                    </p>
                  ) : slots.length === 0 ? (
                    <p className="cl-serif text-[var(--cl-ink-soft)]">
                      No free slots left that day — pick another day.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {slots.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTime(t)}
                          className={`cl-chip ${time === t ? 'cl-chip--on' : ''}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}

              <div className="mt-7 flex items-center gap-3">
                <BackBtn onClick={() => setStep(2)} inline />
                <button
                  type="button"
                  disabled={!date || !time}
                  onClick={() => setStep(4)}
                  className="cl-btn cl-btn--solid disabled:opacity-40 disabled:hover:translate-y-0"
                >
                  Continue <ArrowRightIcon width={16} height={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 4 — details */}
          {step === 4 && (
            <div>
              <StepHead n={4} title="Your details" />

              {/* Summary */}
              <div className="cl-panel mt-5 space-y-1.5 p-4">
                <SummaryRow k="Service" v={service?.name} />
                <SummaryRow k="Doctor" v={doctor ? `${doctor.name} · Room ${doctor.room}` : undefined} />
                <SummaryRow k="When" v={date && time ? `${dateLabel(date)} · ${time}` : undefined} />
                <SummaryRow k="Fee" v={service ? money(service.fee) : undefined} />
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="cl-label">Name</label>
                  <input
                    className="cl-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="cl-label">Phone</label>
                  <input
                    className="cl-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="012-345 6789"
                    inputMode="tel"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="cl-label">Notes (optional)</label>
                <textarea
                  className="cl-input min-h-20 resize-y"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Symptoms, preferences, anything we should know"
                />
              </div>

              <div className="mt-7 flex items-center gap-3">
                <BackBtn onClick={() => setStep(3)} inline />
                <button
                  type="button"
                  disabled={!name.trim()}
                  onClick={confirm}
                  className="cl-btn cl-btn--solid disabled:opacity-40 disabled:hover:translate-y-0"
                >
                  <CalendarIcon width={16} height={16} /> Confirm booking
                </button>
              </div>
              <p className="cl-mono mt-4 text-[11px] text-[var(--cl-ink-soft)]">
                Confirming opens WhatsApp with your details and adds the slot to the live reception board.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

/* ---------------- small helpers ---------------- */

function BookingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--cl-line)] bg-[var(--cl-surface)]/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-2xl items-center justify-between pl-20 pr-6 py-3.5 lg:px-8">
        <Link to="/demos/clinic" className="flex items-center gap-2.5">
          <span className="cl-monogram h-9 w-9 text-base" style={{ background: 'var(--cl-primary)' }}>
            {clinic.monogram}
          </span>
          <span className="cl-display text-lg text-[var(--cl-ink)]">{clinic.name}</span>
        </Link>
        <span className="cl-mono text-[10px] uppercase tracking-widest text-[var(--cl-primary)]">Book</span>
      </nav>
    </header>
  )
}

function StepHead({ n, title }: { n: number; title: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="cl-mono text-sm text-[var(--cl-primary)]">0{n}</span>
      <h2 className="cl-display text-2xl text-[var(--cl-ink)]">{title}</h2>
    </div>
  )
}

function SummaryRow({ k, v }: { k: string; v?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="cl-mono text-[11px] uppercase tracking-widest text-[var(--cl-ink-soft)]">{k}</span>
      <span className="cl-display text-[var(--cl-ink)]">{v ?? '—'}</span>
    </div>
  )
}

function BackBtn({ onClick, inline }: { onClick: () => void; inline?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cl-btn cl-btn--ghost ${inline ? '!py-2 !px-3 text-xs' : 'mt-7'}`}
    >
      Back
    </button>
  )
}
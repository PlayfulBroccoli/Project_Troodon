import { Link } from 'react-router-dom'
import { clinic, doctors, services, money, doctorById, todayISO } from './data'
import { useClinic } from './store'
import {
  StethoscopeIcon,
  CalendarIcon,
  ClockIcon,
  PinIcon,
  ArrowRightIcon,
  UserIcon,
  ToothIcon,
} from './icons'
import './clinic.css'

/**
 * Brand view — the clinic's public home page. The calm, reassuring front door:
 * what we treat, who's here, and a clear path to book. Patients land here; the
 * sidebar carries them to the booking flow. Renders as a fragment (ClinicLayout
 * supplies the shell + sidebar).
 */
export function ClinicDemo() {
  const state = useClinic()
  const today = todayISO()
  const todays = state.appointments.filter(
    (a) => a.date === today && a.status !== 'cancelled',
  ).length

  return (
    <>
      <header className="border-b border-[var(--cl-line)] bg-[var(--cl-surface)]/85 backdrop-blur-md">
        <nav className="mx-auto flex max-w-5xl items-center justify-between pl-20 pr-6 py-3.5 lg:px-8">
          <Link to="/demos/clinic" className="flex items-center gap-2.5">
            <span className="cl-monogram h-9 w-9 text-base" style={{ background: 'var(--cl-primary)' }}>
              {clinic.monogram}
            </span>
            <span className="cl-display text-xl text-[var(--cl-ink)]">{clinic.name}</span>
          </Link>
          <Link to="/demos/clinic/book" className="cl-btn cl-btn--solid !px-4 !py-2 text-xs">
            <CalendarIcon width={15} height={15} /> Book
          </Link>
        </nav>
      </header>

      {/* ---------- Hero ---------- */}
      <section className="mx-auto max-w-5xl px-6 pt-16 pb-12 lg:px-8">
        <div className="cl-rise max-w-2xl">
          <div className="cl-eyebrow mb-4">
            <PinIcon width={13} height={13} className="inline -mt-0.5" /> {clinic.area} · {clinic.hours}
          </div>
          <h1 className="cl-display text-5xl text-[var(--cl-ink)] sm:text-6xl">
            {clinic.name}
          </h1>
          <p className="cl-serif mt-4 text-2xl text-[var(--cl-ink-soft)]">{clinic.tagline}</p>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-[var(--cl-ink-soft)]">
            A neighbourhood clinic for everyday care — general practice, paediatrics, internal
            medicine, skin, and dental. Book a slot online in under a minute; we'll send a reminder
            before your visit.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/demos/clinic/book" className="cl-btn cl-btn--solid">
              <CalendarIcon width={17} height={17} /> Book appointment
            </Link>
            <a href="#services" className="cl-btn cl-btn--ghost">
              What we treat <ArrowRightIcon width={16} height={16} />
            </a>
          </div>
        </div>
      </section>

      {/* ---------- Services ---------- */}
      <section id="services" className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="cl-display text-3xl text-[var(--cl-ink)]">What we treat</h2>
          <span className="cl-mono text-[11px] uppercase tracking-widest text-[var(--cl-ink-soft)]">
            {services.length} services
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            const doc = s.doctorId ? doctorById(s.doctorId) : undefined
            return (
              <div key={s.id} className="cl-card flex flex-col p-5">
                <div className="flex items-start justify-between">
                  <h3 className="cl-display text-lg text-[var(--cl-ink)]">{s.name}</h3>
                  {s.doctorId === 'dr-elias' && <ToothIcon width={18} height={18} className="text-[var(--cl-ink-soft)]" />}
                  {s.doctorId !== 'dr-elias' && <StethoscopeIcon width={18} height={18} className="text-[var(--cl-ink-soft)]" />}
                </div>
                <p className="cl-mono mt-1 text-xs text-[var(--cl-ink-soft)]">
                  <ClockIcon width={12} height={12} className="inline -mt-0.5" /> {s.durationMin} min
                  {doc && <> · {doc.name}</>}
                </p>
                <div className="mt-auto flex items-center justify-between pt-5">
                  <span className="cl-display text-xl text-[var(--cl-primary)]">{money(s.fee)}</span>
                  <Link to="/demos/clinic/book" className="cl-act">Book <ArrowRightIcon width={12} height={12} className="inline -mt-0.5" /></Link>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ---------- Doctors ---------- */}
      <section className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="cl-display text-3xl text-[var(--cl-ink)]">Our doctors</h2>
          <Link to="/demos/clinic/roster" className="cl-mono text-[11px] uppercase tracking-widest text-[var(--cl-primary)] hover:underline">
            Full roster <ArrowRightIcon width={12} height={12} className="inline -mt-0.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((d) => {
            const onToday = !state.daysOff[d.id]?.includes(new Date(`${today}T00:00:00`).getDay())
            const count = state.appointments.filter(
              (a) => a.doctorId === d.id && a.date === today && a.status !== 'cancelled',
            ).length
            return (
              <div key={d.id} className="cl-card flex items-center gap-4 p-5">
                <span className="cl-monogram h-12 w-12 text-sm" style={{ background: d.accent }}>
                  {d.monogram}
                </span>
                <div className="flex-1">
                  <h3 className="cl-display text-lg leading-tight text-[var(--cl-ink)]">{d.name}</h3>
                  <p className="cl-mono text-xs text-[var(--cl-ink-soft)]">{d.specialty} · Room {d.room}</p>
                </div>
                <div className="text-right">
                  <div className={`cl-mono text-[11px] uppercase tracking-widest ${onToday ? 'text-[var(--cl-accent)]' : 'text-[var(--cl-ink-soft)]'}`}>
                    {onToday ? 'In today' : 'Off today'}
                  </div>
                  <div className="cl-mono text-[11px] text-[var(--cl-ink-soft)]">{count} appts</div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ---------- Reassurance ---------- */}
      <section className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
        <div className="cl-card grid grid-cols-1 gap-px overflow-hidden sm:grid-cols-3" style={{ background: 'var(--cl-line)' }}>
          {[
            { t: 'Book online', d: 'Pick a doctor and a free slot — no phone tag.' },
            { t: 'Walk-ins welcome', d: 'Same-day slots held for urgent cases.' },
            { t: 'Visit reminders', d: 'A nudge before your appointment, so you don’t forget.' },
          ].map((f) => (
            <div key={f.t} className="bg-[var(--cl-surface)] p-6">
              <div className="cl-eyebrow mb-2">
                <UserIcon width={13} height={13} className="inline -mt-0.5" /> Today
              </div>
              <h3 className="cl-display text-lg text-[var(--cl-ink)]">{f.t}</h3>
              <p className="mt-1 text-sm text-[var(--cl-ink-soft)]">{f.d}</p>
            </div>
          ))}
        </div>
        <p className="cl-mono mt-5 text-center text-[11px] text-[var(--cl-ink-soft)]">
          {todays} appointments booked today · live across tabs
        </p>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="border-t border-[var(--cl-line)] bg-[var(--cl-surface)]">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-4 px-6 py-8 sm:flex-row sm:items-center lg:px-8">
          <div className="flex items-center gap-2.5">
            <span className="cl-monogram h-8 w-8 text-sm" style={{ background: 'var(--cl-primary)' }}>
              {clinic.monogram}
            </span>
            <div>
              <div className="cl-display text-base text-[var(--cl-ink)]">{clinic.name}</div>
              <div className="cl-mono text-[10px] uppercase tracking-widest text-[var(--cl-ink-soft)]">
                {clinic.area} · {clinic.hours}
              </div>
            </div>
          </div>
          <Link to="/demos/clinic/book" className="cl-btn cl-btn--soft !py-2 text-xs">
            <CalendarIcon width={15} height={15} /> Book an appointment
          </Link>
        </div>
      </footer>
    </>
  )
}
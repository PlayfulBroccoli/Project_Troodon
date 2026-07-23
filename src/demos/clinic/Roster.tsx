import { Link } from 'react-router-dom'
import {
  clinic,
  doctors,
  weekdayShort,
  todayISO,
  dateLabel,
} from './data'
import { useClinic, toggleDayOff, isDoctorOff, availableSlots } from './store'
import { ArrowRightIcon, ClockIcon, PinIcon } from './icons'
import './clinic.css'

/**
 * Doctor roster — the staff scheduling view. Shows each doctor, their room and
 * specialty, and a per-weekday on/off toggle (a doctor's day off immediately
 * removes their slots from the public booking availability, live across tabs).
 * The weekly grid is the same toggles laid out as a matrix.
 */
export function Roster() {
  const state = useClinic()
  const today = todayISO()

  /** Weekdays the clinic is open (Mon–Sat; Sunday is a clinic-wide close). */
  const openDays = [1, 2, 3, 4, 5, 6]

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--cl-line)] bg-[var(--cl-surface)]/90 backdrop-blur-md">
        <nav className="mx-auto flex max-w-5xl items-center justify-between pl-20 pr-6 py-3.5 lg:px-8">
          <div className="flex items-center gap-2.5">
            <span className="cl-monogram h-9 w-9 text-base" style={{ background: 'var(--cl-primary)' }}>
              {clinic.monogram}
            </span>
            <div>
              <div className="cl-display text-lg leading-none text-[var(--cl-ink)]">{clinic.name}</div>
              <div className="cl-mono text-[10px] uppercase tracking-widest text-[var(--cl-primary)]">
                Doctor roster · schedules
              </div>
            </div>
          </div>
          <span className="cl-mono text-[11px] text-[var(--cl-ink-soft)]">
            <PinIcon width={12} height={12} className="inline -mt-0.5" /> {dateLabel(today)}
          </span>
        </nav>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-8 lg:px-8">
        <div className="mb-6 max-w-xl">
          <div className="cl-eyebrow mb-2">Roster</div>
          <h1 className="cl-display text-3xl text-[var(--cl-ink)] sm:text-4xl">Who's in, and when</h1>
          <p className="cl-serif mt-2 text-lg text-[var(--cl-ink-soft)]">
            Toggle a doctor's day off — their booking slots disappear from the patient view instantly.
          </p>
        </div>

        {/* ---------- Doctor cards ---------- */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {doctors.map((d) => {
            const offToday = isDoctorOff(state, d.id, today)
            const slots = offToday ? [] : availableSlots(state, d.id, today)
            const nextSlot = slots[0]
            const count = state.appointments.filter(
              (a) => a.doctorId === d.id && a.date === today && a.status !== 'cancelled',
            ).length
            return (
              <div key={d.id} className="cl-card p-5">
                <div className="flex items-center gap-3">
                  <span className="cl-monogram h-12 w-12 text-sm" style={{ background: d.accent }}>
                    {d.monogram}
                  </span>
                  <div className="flex-1">
                    <h2 className="cl-display text-lg leading-tight text-[var(--cl-ink)]">{d.name}</h2>
                    <p className="cl-mono text-xs text-[var(--cl-ink-soft)]">{d.specialty} · Room {d.room}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {openDays.map((wd) => {
                    const off = (state.daysOff[d.id] ?? []).includes(wd)
                    const isToday = weekdayShort[new Date(`${today}T00:00:00`).getDay()] === weekdayShort[wd]
                    return (
                      <button
                        key={wd}
                        type="button"
                        onClick={() => toggleDayOff(d.id, wd)}
                        className={`cl-chip ${off ? '' : 'cl-chip--on'} ${isToday ? '!ring-2 !ring-[var(--cl-primary)]' : ''}`}
                        aria-pressed={!off}
                      >
                        {weekdayShort[wd]}
                      </button>
                    )
                  })}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-[var(--cl-line)] pt-3">
                  <span className={`cl-mono text-[11px] uppercase tracking-widest ${offToday ? 'text-[var(--cl-ink-soft)]' : 'text-[var(--cl-accent)]'}`}>
                    {offToday ? 'Off today' : 'In today'}
                  </span>
                  <span className="cl-mono text-[11px] text-[var(--cl-ink-soft)]">
                    {offToday ? (
                      '—'
                    ) : nextSlot ? (
                      <>{count} appts · next {nextSlot}</>
                    ) : (
                      <>{count} appts · full</>
                    )}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* ---------- Weekly grid ---------- */}
        <div className="mt-8">
          <h2 className="cl-display mb-3 text-xl text-[var(--cl-ink)]">Weekly availability</h2>
          <div className="cl-panel overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="cl-mono p-3 text-left text-[11px] uppercase tracking-widest text-[var(--cl-ink-soft)]">Doctor</th>
                  {openDays.map((wd) => (
                    <th key={wd} className="cl-mono p-3 text-center text-[11px] uppercase tracking-widest text-[var(--cl-ink-soft)]">
                      {weekdayShort[wd]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {doctors.map((d) => (
                  <tr key={d.id} className="border-t border-[var(--cl-line)]">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="cl-monogram h-7 w-7 text-[10px]" style={{ background: d.accent }}>
                          {d.monogram}
                        </span>
                        <span className="cl-display text-[var(--cl-ink)]">{d.name.split(' ').slice(0, 2).join(' ')}</span>
                      </div>
                    </td>
                    {openDays.map((wd) => {
                      const off = (state.daysOff[d.id] ?? []).includes(wd)
                      return (
                        <td key={wd} className="p-3 text-center">
                          <button
                            type="button"
                            onClick={() => toggleDayOff(d.id, wd)}
                            className={`inline-grid h-7 w-7 place-items-center rounded-full border transition ${
                              off
                                ? 'border-[var(--cl-line)] text-[var(--cl-ink-soft)]'
                                : 'border-[var(--cl-accent)] bg-[var(--cl-accent)] text-white'
                            }`}
                            aria-label={`${d.name} ${weekdayShort[wd]} ${off ? 'off' : 'on'}`}
                          >
                            {off ? '' : <ClockIcon width={13} height={13} />}
                          </button>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="cl-mono mt-3 text-[11px] text-[var(--cl-ink-soft)]">
            Sundays the clinic is closed. Toggles sync live to the patient booking view.
          </p>
        </div>

        <p className="cl-mono mt-8 text-center text-[11px] text-[var(--cl-ink-soft)]">
          <Link to="/demos/clinic/reception" className="text-[var(--cl-primary)] hover:underline">
            Open reception <ArrowRightIcon width={12} height={12} className="inline -mt-0.5" />
          </Link>
        </p>
      </section>
    </>
  )
}
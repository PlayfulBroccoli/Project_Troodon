import { Link } from 'react-router-dom'
import {
  clinic,
  doctors,
  doctorById,
  todayISO,
  statusLabel,
  type Appointment,
  type AppointmentStatus,
} from './data'
import {
  useClinic,
  checkIn,
  callIn,
  complete,
  noShow,
  isDoctorOff,
} from './store'
import { ArrowRightIcon, ClockIcon } from './icons'
import './clinic.css'

/**
 * Reception board — the front-desk view, mirroring the restaurant Floor board.
 * Today at a glance: who's checked in and waiting, who's in the room, and the
 * day's schedule per doctor. The receptionist walks an appointment through its
 * statuses — Check in (scheduled → arrived), Call in (arrived → in-room),
 * Complete (in-room → done), or No-show. Everything is live across tabs: a
 * booking a patient makes in /book appears here in real time.
 */
export function Reception() {
  const state = useClinic()
  const today = todayISO()

  const todays = state.appointments.filter(
    (a) => a.date === today && a.status !== 'cancelled',
  )
  const waiting = todays.filter((a) => a.status === 'arrived')
  const inRoom = todays.filter((a) => a.status === 'in-room')
  const workingDoctors = doctors.filter(
    (d) => !isDoctorOff(state, d.id, today),
  )

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--cl-line)] bg-[var(--cl-surface)]/90 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between pl-20 pr-6 py-3.5 lg:px-8">
          <div className="flex items-center gap-2.5">
            <span className="cl-monogram h-9 w-9 text-base" style={{ background: 'var(--cl-primary)' }}>
              {clinic.monogram}
            </span>
            <div>
              <div className="cl-display text-lg leading-none text-[var(--cl-ink)]">{clinic.name}</div>
              <div className="cl-mono text-[10px] uppercase tracking-widest text-[var(--cl-primary)]">
                Reception · front desk
              </div>
            </div>
          </div>
          <span className="cl-mono text-xs text-[var(--cl-ink-soft)]">
            {waiting.length} waiting · {inRoom.length} in room
          </span>
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-8 lg:px-8">
        {/* ---------- Waiting alerts ---------- */}
        {waiting.length > 0 && (
          <div className="mb-7 space-y-2.5">
            {waiting
              .slice()
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((a) => (
                <div key={a.id} className="cl-alert">
                  <span className="cl-dot cl-dot--arrived" />
                  <div className="flex-1">
                    <div className="cl-display text-[var(--cl-ink)]">
                      {a.patientName} · waiting since {a.time}
                    </div>
                    <div className="cl-mono text-xs text-[var(--cl-ink-soft)]">
                      {a.serviceLabel} · {doctorById(a.doctorId)?.name} · Room {doctorById(a.doctorId)?.room}
                    </div>
                  </div>
                  <button type="button" onClick={() => callIn(a.id)} className="cl-act">
                    Call in <ArrowRightIcon width={12} height={12} className="inline -mt-0.5" />
                  </button>
                </div>
              ))}
          </div>
        )}

        {/* ---------- Schedule per doctor ---------- */}
        <div className="mb-3 flex items-center justify-between">
          <h2 className="cl-display text-2xl text-[var(--cl-ink)]">Today's schedule</h2>
          <span className="cl-mono text-[11px] uppercase tracking-widest text-[var(--cl-ink-soft)]">
            {workingDoctors.length} doctors in
          </span>
        </div>

        {workingDoctors.length === 0 ? (
          <p className="cl-serif text-[var(--cl-ink-soft)]">No doctors in today.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {workingDoctors.map((d) => (
              <DoctorColumn key={d.id} doctorId={d.id} appointments={todays} />
            ))}
          </div>
        )}

        <p className="cl-mono mt-8 text-center text-[11px] text-[var(--cl-ink-soft)]">
          Bookings made in the patient view appear here live.{' '}
          <Link to="/demos/clinic/roster" className="text-[var(--cl-primary)] hover:underline">
            Open roster <ArrowRightIcon width={12} height={12} className="inline -mt-0.5" />
          </Link>
        </p>
      </section>
    </>
  )
}

function DoctorColumn({
  doctorId,
  appointments,
}: {
  doctorId: string
  appointments: Appointment[]
}) {
  const doc = doctorById(doctorId)
  if (!doc) return null
  const list = appointments
    .filter((a) => a.doctorId === doctorId && a.status !== 'cancelled')
    .sort((a, b) => a.time.localeCompare(b.time))

  return (
    <div className="cl-panel flex flex-col p-4">
      <div className="mb-3 flex items-center gap-3 border-b border-[var(--cl-line)] pb-3">
        <span className="cl-monogram h-10 w-10 text-xs" style={{ background: doc.accent }}>
          {doc.monogram}
        </span>
        <div className="flex-1">
          <div className="cl-display text-base leading-tight text-[var(--cl-ink)]">{doc.name}</div>
          <div className="cl-mono text-[11px] text-[var(--cl-ink-soft)]">Room {doc.room}</div>
        </div>
        <span className="cl-mono text-[11px] text-[var(--cl-ink-soft)]">{list.length}</span>
      </div>

      {list.length === 0 ? (
        <p className="cl-mono py-4 text-center text-[11px] text-[var(--cl-ink-soft)]">No appointments</p>
      ) : (
        <div className="space-y-2">
          {list.map((a) => (
            <ApptCard key={a.id} appt={a} />
          ))}
        </div>
      )}
    </div>
  )
}

function ApptCard({ appt }: { appt: Appointment }) {
  return (
    <div className={`cl-appt cl-appt--${appt.status}`}>
      <div className="flex items-baseline justify-between">
        <span className="cl-mono text-sm font-semibold text-[var(--cl-ink)]">{appt.time}</span>
        <span className="cl-mono text-[10px] uppercase tracking-widest text-[var(--cl-ink-soft)] flex items-center gap-1.5">
          <span className={`cl-dot cl-dot--${appt.status}`} />
          {statusLabel[appt.status]}
        </span>
      </div>
      <div className="cl-display mt-1 text-[var(--cl-ink)]">{appt.patientName}</div>
      <div className="cl-mono text-[11px] text-[var(--cl-ink-soft)]">{appt.serviceLabel}</div>
      {appt.notes && (
        <div className="cl-mono mt-1 text-[11px] text-[var(--cl-ink-soft)]">“{appt.notes}”</div>
      )}

      <div className="mt-2.5 flex flex-wrap gap-1.5">
        <Action status={appt.status} id={appt.id} />
      </div>
    </div>
  )
}

/** The next action button depending on the appointment's status. */
function Action({ status, id }: { status: AppointmentStatus; id: string }) {
  if (status === 'scheduled') {
    return (
      <>
        <button type="button" onClick={() => checkIn(id)} className="cl-act">Check in</button>
        <button type="button" onClick={() => noShow(id)} className="cl-act cl-act--ghost">No-show</button>
      </>
    )
  }
  if (status === 'arrived') {
    return <button type="button" onClick={() => callIn(id)} className="cl-act">Call in</button>
  }
  if (status === 'in-room') {
    return <button type="button" onClick={() => complete(id)} className="cl-act">Complete</button>
  }
  // done / no-show / cancelled — nothing to act on
  return <span className="cl-mono text-[10px] text-[var(--cl-ink-soft)]"><ClockIcon width={11} height={11} className="inline -mt-0.5" /> Closed</span>
}
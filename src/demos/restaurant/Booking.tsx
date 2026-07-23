import { useState, type FormEvent } from 'react'
import { whatsappLink } from '../../config/site'
import { Reveal } from '../../components/Reveal'
import { restaurant, bookingSlots, partySizes } from './data'
import { CheckIcon, CalendarIcon, ClockIcon, PinIcon, ArrowRightIcon } from './icons'

/**
 * Table booking — a reservation card. On submit it composes a booking summary
 * and hands off to WhatsApp (no backend). Mirrors the studio's Contact form
 * pattern: in-page success state, no server round-trip.
 *
 * NOTE: this is a demo — slot availability isn't real. A production build would
 * back this with an availability API (see docs/ROADMAP.md "Backend for the form").
 */
export function Booking() {
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [party, setParty] = useState(2)
  const [slot, setSlot] = useState(bookingSlots[4].label)
  const [notes, setNotes] = useState('')
  const [sent, setSent] = useState(false)

  const summary = () =>
    `${restaurant.bookingMessage}\n\n` +
    `Name: ${name}\n` +
    `Date: ${date || '—'}\n` +
    `Time: ${slot}\n` +
    `Party: ${party}\n` +
    (notes ? `Notes: ${notes}\n` : '')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    window.open(whatsappLink(summary()), '_blank', 'noopener,noreferrer')
    setSent(true)
  }

  // min date = today (no Date.now() needed — the input natively floors it)
  const today = new Date().toISOString().split('T')[0]

  return (
    <section className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <Reveal>
        <div className="mb-9 text-center">
          <div className="rd-eyebrow mb-3">Reservations</div>
          <h2 className="rd-display text-3xl text-[var(--rd-ink)] sm:text-4xl">Book a table</h2>
          <p className="rd-italic mt-2 text-[var(--rd-ink-soft)]">
            Lunch and dinner, six days a week. Walk-ins welcome too.
          </p>
        </div>
      </Reveal>

      <Reveal>
        <div className="rd-panel p-6 sm:p-9">
          {sent ? (
            <div className="text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--rd-olive)] text-white">
                <CheckIcon width={24} height={24} />
              </div>
              <h3 className="rd-display mt-4 text-2xl text-[var(--rd-ink)]">Request sent</h3>
              <p className="rd-italic mt-2 text-[var(--rd-ink-soft)]">
                Your booking is ready in WhatsApp — send it there to confirm. We&rsquo;ll reply with a
                table number.
              </p>
              <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
                <a href={whatsappLink(summary())} target="_blank" rel="noopener noreferrer" className="rd-btn rd-btn--ghost">
                  Open WhatsApp again
                </a>
                <button type="button" onClick={() => setSent(false)} className="rd-btn rd-btn--solid">
                  Edit booking
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-6">
              <div>
                <label htmlFor="bk-name" className="rd-label">Name</label>
                <input
                  id="bk-name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rd-input"
                  placeholder="Your name"
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="bk-date" className="rd-label">Date</label>
                  <input
                    id="bk-date"
                    type="date"
                    required
                    min={today}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="rd-input"
                  />
                </div>
                <div>
                  <span className="rd-label">Party size</span>
                  <div className="flex flex-wrap gap-2">
                    {partySizes.map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setParty(n)}
                        aria-pressed={n === party}
                        className={`rd-chip ${n === party ? 'rd-chip--on' : ''}`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <span className="rd-label">Time slot</span>
                <div className="space-y-4">
                  {(['Lunch', 'Dinner'] as const).map((service) => (
                    <div key={service}>
                      <div className="rd-mono mb-2 text-[10px] uppercase tracking-widest text-[var(--rd-ink-soft)]">
                        {service}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {bookingSlots
                          .filter((s) => s.service === service)
                          .map((s) => (
                            <button
                              key={s.label}
                              type="button"
                              onClick={() => setSlot(s.label)}
                              aria-pressed={s.label === slot}
                              className={`rd-chip ${s.label === slot ? 'rd-chip--on' : ''}`}
                            >
                              {s.label}
                            </button>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="bk-notes" className="rd-label">Notes (optional)</label>
                <textarea
                  id="bk-notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="rd-input resize-y"
                  placeholder="High chair, birthday, allergies…"
                />
              </div>

              <button type="submit" className="rd-btn rd-btn--clay w-full">
                Request table
                <ArrowRightIcon width={16} height={16} />
              </button>
              <p className="rd-mono text-center text-[11px] text-[var(--rd-ink-soft)]">
                Opens WhatsApp with your booking prefilled. No deposit needed.
              </p>
            </form>
          )}
        </div>
      </Reveal>

      {/* Small details strip */}
      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { icon: <ClockIcon width={16} height={16} />, label: restaurant.hours },
          { icon: <PinIcon width={16} height={16} />, label: restaurant.area },
          { icon: <CalendarIcon width={16} height={16} />, label: 'No deposit · free to cancel' },
        ].map((d) => (
          <div key={d.label} className="rd-mono flex items-center justify-center gap-2 rd-panel px-4 py-3 text-[11px] uppercase tracking-wider text-[var(--rd-ink-soft)]">
            {d.icon}
            {d.label}
          </div>
        ))}
      </div>
    </section>
  )
}
import { useEffect, useState } from 'react'
import { whatsappLink } from '../config/site'
import { CheckIcon, WhatsAppIcon } from './icons'
import {
  fetchAvailability,
  createBooking,
  type DayGroup,
  type Slot,
} from '../lib/booking'

/**
 * Self-contained "Book a call" card. Loads availability from the booking API,
 * lets the visitor pick a slot and confirm. If the API is unreachable, it falls
 * back to the WhatsApp "request a time" flow so the page still works.
 */

type Phase = 'loading' | 'ready' | 'unavailable' | 'confirmed'

const bookViaWhatsApp = whatsappLink(
  'Hi! I’d like to book a quick call about a website project.',
)

export function BookingWidget() {
  const [phase, setPhase] = useState<Phase>('loading')
  const [days, setDays] = useState<DayGroup[]>([])
  const [activeDate, setActiveDate] = useState<string>('')
  const [slot, setSlot] = useState<Slot | null>(null)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [note, setNote] = useState('')
  const [company, setCompany] = useState('') // honeypot
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setPhase('loading')
    try {
      const groups = await fetchAvailability()
      setDays(groups)
      setActiveDate(groups[0]?.date ?? '')
      setPhase(groups.length ? 'ready' : 'unavailable')
    } catch {
      setPhase('unavailable')
    }
  }

  useEffect(() => {
    void load()
  }, [])

  async function confirm(e: React.FormEvent) {
    e.preventDefault()
    if (!slot) return
    setSubmitting(true)
    setError(null)
    try {
      await createBooking({ start: slot.start, name, email, phone, note, company })
      setPhase('confirmed')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Booking failed.'
      setError(msg)
      // If the slot was taken, refresh availability so the user can re-pick.
      if (/no longer|just taken/i.test(msg)) {
        await load()
        setSlot(null)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const activeDay = days.find((d) => d.date === activeDate)

  return (
    <div className="card-glass p-6 sm:p-8">
      <h2 className="mb-1 text-lg font-bold text-gray-900">Book a call</h2>
      <p className="mb-4 text-sm text-gray-500">
        Grab a 20-minute slot to talk through your idea — no obligation.
      </p>

      {phase === 'loading' && (
        <div className="rounded-xl border border-gray-200 bg-white/50 p-5 text-center text-sm text-gray-400">
          Loading available times…
        </div>
      )}

      {phase === 'unavailable' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-dashed border-gray-300 bg-white/50 p-5 text-center text-sm text-gray-500">
            {days.length === 0
              ? 'No open slots right now.'
              : 'Online booking is temporarily unavailable.'}{' '}
            Message me and we'll find a time.
          </div>
          <a
            href={bookViaWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full"
          >
            Request a time
          </a>
        </div>
      )}

      {phase === 'confirmed' && slot && (
        <div className="rounded-xl border border-brand-500/30 bg-brand-50 p-6 text-center">
          <div className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-full bg-brand-600 text-white">
            <CheckIcon width={22} height={22} />
          </div>
          <h3 className="font-bold text-gray-900">You're booked!</h3>
          <p className="mt-1 text-sm text-gray-600">
            {slot.dateLabel} at {slot.time}. I'll be in touch to confirm — talk soon.
          </p>
        </div>
      )}

      {phase === 'ready' && (
        <div className="space-y-5">
          {/* Date picker */}
          <div>
            <div className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">
              Pick a day
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {days.map((d) => {
                const active = d.date === activeDate
                return (
                  <button
                    key={d.date}
                    type="button"
                    onClick={() => {
                      setActiveDate(d.date)
                      setSlot(null)
                    }}
                    className={`shrink-0 rounded-lg border px-3 py-2 text-xs font-medium transition ${
                      active
                        ? 'border-brand-500 bg-brand-50 text-brand-700'
                        : 'border-gray-200 bg-white/60 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {d.dateLabel}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Time picker */}
          {activeDay && (
            <div>
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                Pick a time
              </div>
              <div className="grid grid-cols-3 gap-2">
                {activeDay.slots.map((s) => {
                  const active = slot?.start === s.start
                  return (
                    <button
                      key={s.start}
                      type="button"
                      onClick={() => setSlot(s)}
                      className={`rounded-lg border py-2 text-sm font-medium transition ${
                        active
                          ? 'border-brand-600 bg-brand-600 text-white'
                          : 'border-gray-200 bg-white/60 text-gray-700 hover:border-brand-400'
                      }`}
                    >
                      {s.time}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Details form — only once a slot is chosen */}
          {slot && (
            <form onSubmit={confirm} className="space-y-3 border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-600">
                Booking{' '}
                <span className="font-bold text-gray-900">
                  {slot.dateLabel} at {slot.time}
                </span>
              </p>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={bwInput}
                placeholder="Your name"
                aria-label="Your name"
              />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={bwInput}
                placeholder="you@example.com"
                aria-label="Your email"
              />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={bwInput}
                placeholder="Phone (optional)"
                aria-label="Your phone"
              />
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                className={`${bwInput} resize-y`}
                placeholder="Anything I should know? (optional)"
                aria-label="Note"
              />
              {/* Honeypot */}
              <div className="absolute left-[-9999px]" aria-hidden="true">
                <label>
                  Company
                  <input
                    tabIndex={-1}
                    autoComplete="off"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </label>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button type="submit" disabled={submitting} className="btn-primary w-full">
                {submitting ? 'Booking…' : 'Confirm booking'}
              </button>
            </form>
          )}

          <div className="border-t border-gray-200 pt-3 text-center">
            <a
              href={bookViaWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-brand-700"
            >
              <WhatsAppIcon width={14} height={14} />
              Prefer WhatsApp? Request a time
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

const bwInput =
  'w-full rounded-lg border border-gray-300 bg-white/70 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'

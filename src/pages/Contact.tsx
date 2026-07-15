import { useState, type FormEvent } from 'react'
import { site, whatsappLink } from '../config/site'
import { CheckIcon } from '../components/icons'

/**
 * Contact page — a single enquiry form, centred.
 *
 * The form currently has NO backend — on submit it composes a summary and
 * opens WhatsApp (with an email fallback), which works on a static host today.
 * To store leads server-side, wire `submitEnquiry` to a real endpoint (see
 * docs/ROADMAP.md "Backend for the form + booking"). A honeypot field is
 * already in place for spam protection.
 */

const projectTypes = ['Landing page', 'Business website', 'Web app', 'Not sure yet']
const budgets = ['Under RM 1,500', 'RM 1,500–3,000', 'RM 3,000–6,000', 'RM 6,000+', 'Not sure yet']

type FormState = {
  name: string
  email: string
  phone: string
  projectType: string
  budget: string
  message: string
  company: string // honeypot — must stay empty
}

const EMPTY: FormState = {
  name: '',
  email: '',
  phone: '',
  projectType: projectTypes[0],
  budget: budgets[0],
  message: '',
  company: '',
}

export function Contact() {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [sent, setSent] = useState(false)

  const set = (key: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const summary = () =>
    `New enquiry\n` +
    `Name: ${form.name}\n` +
    `Email: ${form.email}\n` +
    `Phone: ${form.phone || '—'}\n` +
    `Project: ${form.projectType}\n` +
    `Budget: ${form.budget}\n\n` +
    `${form.message}`

  const submitEnquiry = (e: FormEvent) => {
    e.preventDefault()
    // Honeypot: real users never fill this hidden field.
    if (form.company) return
    // No backend yet — hand off to WhatsApp with a prefilled summary.
    window.open(whatsappLink(summary()), '_blank', 'noopener,noreferrer')
    setSent(true)
  }

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="mx-auto max-w-3xl px-6 pt-16 pb-10 text-center">
        <span className="badge mb-5 inline-block">Contact</span>
        <h1 className="mb-4 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
          Let's talk about your project
        </h1>
        <p className="mx-auto max-w-xl text-lg text-gray-500">
          Send an enquiry below and I'll get back with next steps and a quote. I usually reply the
          same day.
        </p>
      </section>

      {/* ---------- Enquiry form ---------- */}
      <section className="mx-auto max-w-2xl px-6 pb-20">
        <div className="card-glass p-6 sm:p-8">
          <h2 className="mb-1 text-lg font-bold text-gray-900">Send an enquiry</h2>
          <p className="mb-6 text-sm text-gray-500">
            Tell me a bit about what you need and I'll get back with next steps and a quote.
          </p>

          {sent ? (
            <div className="rounded-xl border border-brand-500/30 bg-brand-50 p-6 text-center">
              <div className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-full bg-brand-600 text-white">
                <CheckIcon width={22} height={22} />
              </div>
              <h3 className="font-bold text-gray-900">Almost there!</h3>
              <p className="mt-1 text-sm text-gray-600">
                Your details are ready in WhatsApp, just hit send there. Didn't open?{' '}
                <a
                  href={whatsappLink(summary())}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-brand-600 underline hover:text-brand-800"
                >
                  Open WhatsApp
                </a>{' '}
                or{' '}
                <a
                  href={`mailto:${site.contact.email}?subject=${encodeURIComponent(
                    'Website enquiry',
                  )}&body=${encodeURIComponent(summary())}`}
                  className="font-medium text-brand-600 underline hover:text-brand-800"
                >
                  email instead
                </a>
                .
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="btn-secondary mt-5"
              >
                Edit enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={submitEnquiry} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Name" htmlFor="name">
                  <input
                    id="name"
                    required
                    value={form.name}
                    onChange={set('name')}
                    className={inputClass}
                    placeholder="Your name"
                  />
                </Field>
                <Field label="Email" htmlFor="email">
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={set('email')}
                    className={inputClass}
                    placeholder="you@example.com"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Phone (optional)" htmlFor="phone">
                  <input
                    id="phone"
                    value={form.phone}
                    onChange={set('phone')}
                    className={inputClass}
                    placeholder="+60…"
                  />
                </Field>
                <Field label="Project type" htmlFor="projectType">
                  <select
                    id="projectType"
                    value={form.projectType}
                    onChange={set('projectType')}
                    className={inputClass}
                  >
                    {projectTypes.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Budget" htmlFor="budget">
                <select
                  id="budget"
                  value={form.budget}
                  onChange={set('budget')}
                  className={inputClass}
                >
                  {budgets.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              </Field>

              <Field label="Message" htmlFor="message">
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={set('message')}
                  className={`${inputClass} resize-y`}
                  placeholder="What are you looking to build?"
                />
              </Field>

              {/* Honeypot — visually hidden, off-screen, ignored by real users */}
              <div className="absolute left-[-9999px]" aria-hidden="true">
                <label>
                  Company
                  <input
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.company}
                    onChange={set('company')}
                  />
                </label>
              </div>

              <button type="submit" className="btn-primary w-full">
                Send enquiry
              </button>
              <p className="text-center text-xs text-gray-400">
                This opens WhatsApp with your details prefilled. Prefer email?{' '}
                <a
                  href={`mailto:${site.contact.email}`}
                  className="text-brand-600 hover:text-brand-800"
                >
                  {site.contact.email}
                </a>
              </p>
            </form>
          )}
        </div>
      </section>
    </>
  )
}

const inputClass =
  'w-full rounded-lg border border-gray-300 bg-white/70 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor: string
  children: React.ReactNode
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="mb-1.5 block text-sm font-medium text-gray-700">{label}</span>
      {children}
    </label>
  )
}
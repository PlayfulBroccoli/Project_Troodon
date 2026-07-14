import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { whatsappLink } from '../config/site'
import { CheckIcon, ArrowRightIcon, WhatsAppIcon } from '../components/icons'
import {
  projectTypes,
  features,
  carePlans,
  PER_PAGE,
  MIN_PAGES,
  MAX_PAGES,
  round50,
  money,
  HOSTING_NOTE,
} from '../config/pricing'

/**
 * Quote wizard — an interactive, multi-step estimator that ends in an
 * itemised breakdown with two totals: a one-off UPFRONT build cost and an
 * optional MONTHLY care plan. Reads all numbers from config/pricing.ts so it
 * never drifts from the /pricing page. It's an estimate, not a binding quote —
 * every path ends in a real "Get an exact quote" action.
 */

const STEPS = ['Project', 'Pages', 'Features', 'Support', 'Your quote'] as const

export function Quote() {
  const [step, setStep] = useState(0)
  const [typeKey, setTypeKey] = useState('business')
  const [pages, setPages] = useState(5)
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [careKey, setCareKey] = useState('essential')

  const type = projectTypes.find((t) => t.key === typeKey)!
  const care = carePlans.find((c) => c.key === careKey)!
  const chosenFeatures = features.filter((f) => selected[f.key])

  const breakdown = useMemo(() => {
    const extraPages = Math.max(0, pages - type.includedPages)
    const lines: { label: string; amount: number }[] = [
      { label: `${type.label} (base)`, amount: type.base },
    ]
    if (extraPages > 0) {
      lines.push({
        label: `${extraPages} extra page${extraPages > 1 ? 's' : ''} × ${money(PER_PAGE)}`,
        amount: extraPages * PER_PAGE,
      })
    }
    for (const f of chosenFeatures) {
      lines.push({ label: f.label, amount: f.price })
    }
    const upfront = round50(lines.reduce((sum, l) => sum + l.amount, 0))
    return { lines, upfront, extraPages }
  }, [type, pages, chosenFeatures])

  const toggle = (key: string) => setSelected((s) => ({ ...s, [key]: !s[key] }))

  /** Prefilled WhatsApp message summarising the whole quote. */
  const waMessage = useMemo(() => {
    const feats = chosenFeatures.length
      ? chosenFeatures.map((f) => f.label).join(', ')
      : 'none'
    const careLine =
      care.monthly > 0 ? `${care.label} at ${money(care.monthly)}/mo` : 'no monthly plan'
    return (
      `Hi! I built a quote and got:\n` +
      `• Upfront: ${money(breakdown.upfront)}\n` +
      `• Monthly: ${care.monthly > 0 ? `${money(care.monthly)}/mo` : 'RM 0'}\n\n` +
      `Project: ${type.label}\nPages: ${pages}\nFeatures: ${feats}\nSupport: ${careLine}\n\n` +
      `I'd like an exact quote please.`
    )
  }, [type, pages, chosenFeatures, care, breakdown])

  const isLast = step === STEPS.length - 1
  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1))
  const back = () => setStep((s) => Math.max(s - 1, 0))

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="mx-auto max-w-3xl px-6 pt-16 pb-8 text-center">
        <span className="badge mb-5 inline-block">Instant quote</span>
        <h1 className="mb-3 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
          Build your quote
        </h1>
        <p className="mx-auto max-w-xl text-lg text-gray-500">
          Answer a few quick questions for an itemised estimate: upfront build cost and an optional
          monthly care plan.
        </p>
      </section>

      {/* ---------- Stepper ---------- */}
      <section className="mx-auto max-w-3xl px-6">
        <ol className="flex items-center justify-between gap-2">
          {STEPS.map((label, i) => {
            const state = i < step ? 'done' : i === step ? 'active' : 'todo'
            return (
              <li key={label} className="flex flex-1 items-center gap-2 last:flex-none">
                <button
                  type="button"
                  onClick={() => i <= step && setStep(i)}
                  disabled={i > step}
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold transition ${
                    state === 'done'
                      ? 'bg-brand-600 text-white'
                      : state === 'active'
                        ? 'bg-brand-600 text-white ring-4 ring-brand-500/20'
                        : 'bg-gray-200 text-gray-500'
                  }`}
                  aria-current={state === 'active' ? 'step' : undefined}
                >
                  {state === 'done' ? <CheckIcon width={16} height={16} /> : i + 1}
                </button>
                <span
                  className={`hidden text-sm font-medium sm:inline ${
                    state === 'todo' ? 'text-gray-400' : 'text-gray-700'
                  }`}
                >
                  {label}
                </span>
                {i < STEPS.length - 1 && (
                  <span className="mx-1 hidden h-px flex-1 bg-gray-200 sm:block" />
                )}
              </li>
            )
          })}
        </ol>
      </section>

      {/* ---------- Step body ---------- */}
      <section className="mx-auto max-w-3xl px-6 pb-8 pt-8">
        <div className="card-glass p-6 sm:p-8">
          {/* Step 1 — Project type */}
          {step === 0 && (
            <Step title="What are we building?" subtitle="Pick the closest fit. You can refine later.">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {projectTypes.map((t) => {
                  const active = t.key === typeKey
                  return (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => setTypeKey(t.key)}
                      aria-pressed={active}
                      className={`rounded-xl border p-4 text-left transition ${
                        active
                          ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500/20'
                          : 'border-gray-200 bg-white/60 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-bold text-gray-900">{t.label}</div>
                      <div className="mt-1 text-xs text-gray-500">{t.blurb}</div>
                      <div className="mt-2 text-xs font-medium text-brand-600">
                        from {money(t.base)}
                      </div>
                    </button>
                  )
                })}
              </div>
            </Step>
          )}

          {/* Step 2 — Pages */}
          {step === 1 && (
            <Step title="How many pages?" subtitle="Rough is fine. We'll firm it up on a call.">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-gray-500">
                  {type.includedPages} included with a {type.label.toLowerCase()}
                </span>
                <span className="text-3xl font-bold text-brand-600">{pages}</span>
              </div>
              <input
                type="range"
                min={MIN_PAGES}
                max={MAX_PAGES}
                value={pages}
                onChange={(e) => setPages(Number(e.target.value))}
                aria-label="Number of pages"
                className="mt-3 w-full accent-brand-600"
              />
              <div className="mt-1 flex justify-between text-xs text-gray-400">
                <span>{MIN_PAGES}</span>
                <span>{MAX_PAGES}+</span>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                {breakdown.extraPages > 0
                  ? `${breakdown.extraPages} extra page${breakdown.extraPages > 1 ? 's' : ''} at ${money(
                      PER_PAGE,
                    )} each.`
                  : 'No extra pages. You’re within the included count.'}
              </p>
            </Step>
          )}

          {/* Step 3 — Features */}
          {step === 2 && (
            <Step title="Any extra features?" subtitle="Add anything you need, skip what you don't.">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {features.map((f) => {
                  const active = !!selected[f.key]
                  return (
                    <label
                      key={f.key}
                      className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-3.5 transition ${
                        active
                          ? 'border-brand-500 bg-brand-50'
                          : 'border-gray-200 bg-white/60 hover:border-gray-300'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`grid h-5 w-5 shrink-0 place-items-center rounded border transition ${
                            active ? 'border-brand-600 bg-brand-600 text-white' : 'border-gray-300'
                          }`}
                        >
                          {active && <CheckIcon width={13} height={13} />}
                        </span>
                        <span className="text-sm font-medium text-gray-700">{f.label}</span>
                      </span>
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={() => toggle(f.key)}
                        className="sr-only"
                      />
                      <span className="shrink-0 text-xs text-gray-400">+{money(f.price)}</span>
                    </label>
                  )
                })}
              </div>
            </Step>
          )}

          {/* Step 4 — Support */}
          {step === 3 && (
            <Step title="Ongoing care?" subtitle="Pick a monthly care plan for management, updates & support. Hosting is separate.">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {carePlans.map((c) => {
                  const active = c.key === careKey
                  return (
                    <button
                      key={c.key}
                      type="button"
                      onClick={() => setCareKey(c.key)}
                      aria-pressed={active}
                      className={`flex flex-col rounded-xl border p-4 text-left transition ${
                        active
                          ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500/20'
                          : 'border-gray-200 bg-white/60 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-bold text-gray-900">{c.label}</div>
                      <div className="mt-1 text-lg font-bold text-brand-600">
                        {c.monthly === 0 ? 'Free' : `${money(c.monthly)}/mo`}
                      </div>
                      <div className="mt-1 text-xs text-gray-500">{c.blurb}</div>
                    </button>
                  )
                })}
              </div>
              <p className="mt-4 text-xs text-gray-400">{HOSTING_NOTE}</p>
            </Step>
          )}

          {/* Step 5 — Breakdown */}
          {step === 4 && (
            <Step title="Your estimate" subtitle="An itemised breakdown. Not binding. I'll confirm it after a quick chat.">
              <div className="rounded-xl border border-gray-200 bg-white/60 p-5">
                <div className="text-xs font-bold uppercase tracking-wider text-brand-600">
                  One-off build
                </div>
                <dl className="mt-3 space-y-2 text-sm">
                  {breakdown.lines.map((l) => (
                    <div key={l.label} className="flex justify-between gap-4">
                      <dt className="text-gray-600">{l.label}</dt>
                      <dd className="shrink-0 font-medium text-gray-900">{money(l.amount)}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-4 flex items-baseline justify-between border-t border-gray-200 pt-4">
                  <span className="font-bold text-gray-900">Upfront total</span>
                  <span className="text-2xl font-bold text-gray-900">{money(breakdown.upfront)}</span>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-gray-200 bg-white/60 p-5">
                <div className="text-xs font-bold uppercase tracking-wider text-brand-600">
                  Monthly support
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-gray-600">{care.label}</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {care.monthly === 0 ? (
                      money(0)
                    ) : (
                      <>
                        {money(care.monthly)}
                        <span className="text-base font-medium text-gray-400"> /mo</span>
                      </>
                    )}
                  </span>
                </div>
                <p className="mt-3 border-t border-gray-200 pt-3 text-xs text-gray-400">
                  {HOSTING_NOTE}
                </p>
              </div>

              {/* Grand summary */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-brand-600 p-5 text-white">
                  <div className="text-xs font-medium uppercase tracking-wider text-brand-100">
                    Pay upfront
                  </div>
                  <div className="mt-1 text-2xl font-bold">{money(breakdown.upfront)}</div>
                </div>
                <div className="rounded-xl border border-brand-200 bg-brand-50 p-5">
                  <div className="text-xs font-medium uppercase tracking-wider text-brand-600">
                    Then monthly
                  </div>
                  <div className="mt-1 text-2xl font-bold text-gray-900">
                    {care.monthly === 0 ? money(0) : `${money(care.monthly)}`}
                    {care.monthly > 0 && (
                      <span className="text-base font-medium text-gray-400"> /mo</span>
                    )}
                  </div>
                </div>
              </div>

              <p className="mt-4 text-xs text-gray-400">
                Estimate only. Your exact price depends on the details. I'll confirm it after a
                quick chat.
              </p>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link to="/contact" className="btn-primary w-full">
                  Get an exact quote
                  <ArrowRightIcon className="ml-2" width={18} height={18} />
                </Link>
                <a
                  href={whatsappLink(waMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp w-full"
                >
                  <WhatsAppIcon width={18} height={18} />
                  Send on WhatsApp
                </a>
              </div>
            </Step>
          )}
        </div>

        {/* Nav buttons + running total (hidden on final step) */}
        {!isLast && (
          <div className="mt-6 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={back}
              disabled={step === 0}
              className="btn-secondary disabled:cursor-not-allowed disabled:opacity-40"
            >
              Back
            </button>
            <div className="text-right">
              <div className="text-xs text-gray-400">Running estimate</div>
              <div className="font-bold text-gray-900">
                {money(breakdown.upfront)}
                {care.monthly > 0 && (
                  <span className="text-sm font-medium text-gray-400">
                    {' '}
                    + {money(care.monthly)}/mo
                  </span>
                )}
              </div>
            </div>
            <button type="button" onClick={next} className="btn-primary">
              {step === STEPS.length - 2 ? 'See quote' : 'Next'}
              <ArrowRightIcon className="ml-2" width={18} height={18} />
            </button>
          </div>
        )}
      </section>
    </>
  )
}

/** Consistent step header + body wrapper. */
function Step({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      {subtitle && <p className="mb-5 mt-1 text-sm text-gray-500">{subtitle}</p>}
      {!subtitle && <div className="mb-5" />}
      {children}
    </div>
  )
}

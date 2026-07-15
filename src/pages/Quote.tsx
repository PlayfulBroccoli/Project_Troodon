import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { whatsappLink } from '../config/site'
import {
  CheckIcon,
  ArrowRightIcon,
  WhatsAppIcon,
  RocketIcon,
  BriefcaseIcon,
  CodeIcon,
  LayersIcon,
  SparklesIcon,
  LifeBuoyIcon,
  GlobeIcon,
  ShieldCheckIcon,
} from '../components/icons'
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
import type { ComponentType, SVGProps } from 'react'

/**
 * Quote wizard — an interactive, multi-step estimator that ends in an
 * itemised breakdown with two totals: a one-off UPFRONT build cost and an
 * optional MONTHLY care plan. Reads all numbers from config/pricing.ts so it
 * never drifts from the /pricing page. It's an estimate, not a binding quote —
 * every path ends in a real "Get an exact quote" action.
 *
 * Flow: a simple start screen → one step at a time → a final breakdown that
 * recaps the selections ("Your build") before showing the totals and CTAs.
 */

const STEPS = ['Project', 'Pages', 'Features', 'Support', 'Your quote'] as const

/** Icon per project type, keyed by config key so config stays the source of truth. */
const TYPE_ICONS: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  landing: RocketIcon,
  business: BriefcaseIcon,
  webapp: CodeIcon,
}

export function Quote() {
  const [started, setStarted] = useState(false)
  const [step, setStep] = useState(0)
  const [typeKey, setTypeKey] = useState('business')
  const [pages, setPages] = useState(5)
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [careKey, setCareKey] = useState('essential')
  const [hasDomain, setHasDomain] = useState(true)

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
    const careLine = `${care.label} at ${money(care.monthly)}/mo (hosting included)`
    const domainLine = hasDomain
      ? 'I have my own domain'
      : 'Need a domain (charged separately)'
    return (
      `Hi! I built a quote and got:\n` +
      `• Upfront: ${money(breakdown.upfront)}\n` +
      `• Monthly: ${money(care.monthly)}/mo\n\n` +
      `Project: ${type.label}\nPages: ${pages}\nFeatures: ${feats}\nSupport: ${careLine}\nDomain: ${domainLine}\n\n` +
      `I'd like an exact quote please.`
    )
  }, [type, pages, chosenFeatures, care, breakdown, hasDomain])

  const isLast = step === STEPS.length - 1
  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1))
  const back = () => setStep((s) => Math.max(s - 1, 0))
  const progress = (step / (STEPS.length - 1)) * 100

  return (
    <>
      {/* ---------- Start screen ---------- */}
      {!started && (
        <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
          <span className="badge mb-5 inline-block hero-in">Instant quote</span>
          <h1 className="hero-in mb-4 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
            Build your quote
          </h1>
          <p className="hero-in mx-auto max-w-xl text-lg text-gray-500">
            Answer a few quick questions for an itemised estimate: an upfront build cost and an
            optional monthly care plan.
          </p>
          <div className="hero-in mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-gray-400">
            <span className="inline-flex items-center gap-1.5">
              <CheckIcon className="text-brand-600" width={14} height={14} /> Takes about 2 minutes
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckIcon className="text-brand-600" width={14} height={14} /> No signup
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckIcon className="text-brand-600" width={14} height={14} /> No commitment
            </span>
          </div>

          <div className="hero-in mt-9 flex w-full flex-col items-center">
            <button
              type="button"
              onClick={() => setStarted(true)}
              className="btn-primary w-full sm:w-auto"
            >
              Start my quote
              <ArrowRightIcon className="ml-2" width={18} height={18} />
            </button>
          </div>
        </section>
      )}

      {/* ---------- Wizard ---------- */}
      {started && (
        <section className="mx-auto max-w-3xl px-6 pt-12 pb-20">
          {/* Stepper */}
          <div className="card-glass mb-6 rounded-2xl p-5 sm:p-6">
            <ol className="flex items-center gap-2">
              {STEPS.map((label, i) => {
                const state = i < step ? 'done' : i === step ? 'active' : 'todo'
                return (
                  <li key={label} className="flex flex-1 items-center gap-2 last:flex-none">
                    <button
                      type="button"
                      onClick={() => i <= step && setStep(i)}
                      disabled={i > step}
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold transition ${
                        state === 'done'
                          ? 'bg-brand-600 text-white'
                          : state === 'active'
                            ? 'bg-brand-600 text-white ring-4 ring-brand-500/20'
                            : 'bg-gray-100 text-gray-400'
                      }`}
                      aria-current={state === 'active' ? 'step' : undefined}
                    >
                      {state === 'done' ? <CheckIcon width={16} height={16} /> : i + 1}
                    </button>
                    <span
                      className={`hidden text-sm font-medium sm:inline ${
                        state === 'todo' ? 'text-gray-400' : 'text-gray-800'
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
            <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-brand-600 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Step body */}
          <div className="card-glass flex flex-1 flex-col p-6 sm:p-8">
            {/* Step 1 — Project type */}
            {step === 0 && (
              <Step
                title="What are we building?"
                subtitle="Pick the closest fit. You can refine later."
                icon={<LayersIcon className="text-brand-600" width={22} height={22} />}
              >
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {projectTypes.map((t) => {
                    const active = t.key === typeKey
                    const Icon = TYPE_ICONS[t.key] ?? LayersIcon
                    return (
                      <button
                        key={t.key}
                        type="button"
                        onClick={() => setTypeKey(t.key)}
                        aria-pressed={active}
                        className={`group relative flex flex-col rounded-xl border p-4 text-left transition ${
                          active
                            ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500/20'
                            : 'border-gray-200 bg-white/60 hover:border-gray-300 hover:-translate-y-0.5'
                        }`}
                      >
                        {t.featured && (
                          <span className="badge absolute -top-2.5 right-3">Popular</span>
                        )}
                        <span
                          className={`grid h-10 w-10 place-items-center rounded-lg transition ${
                            active
                              ? 'bg-brand-600 text-white'
                              : 'bg-brand-50 text-brand-600 group-hover:bg-brand-100'
                          }`}
                        >
                          <Icon width={20} height={20} />
                        </span>
                        <div className="mt-3 font-bold text-gray-900">{t.label}</div>
                        <div className="mt-1 text-xs text-gray-500">{t.blurb}</div>
                        <div className="mt-3 text-xs font-semibold text-brand-600">
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
              <Step
                title="How many pages?"
                subtitle="Rough is fine. We'll firm it up on a call."
                icon={<LayersIcon className="text-brand-600" width={22} height={22} />}
              >
                <div className="flex items-end justify-between">
                  <span className="text-sm text-gray-500">
                    {type.includedPages} included with a {type.label.toLowerCase()}
                  </span>
                  <span className="text-4xl font-bold leading-none text-brand-600">{pages}</span>
                </div>
                <input
                  type="range"
                  min={MIN_PAGES}
                  max={MAX_PAGES}
                  value={pages}
                  onChange={(e) => setPages(Number(e.target.value))}
                  aria-label="Number of pages"
                  className="mt-5 w-full accent-brand-600"
                />
                <div className="mt-1 flex justify-between text-xs text-gray-400">
                  <span>{MIN_PAGES}</span>
                  <span>{MAX_PAGES}+</span>
                </div>
                <p className="mt-5 rounded-lg bg-brand-50 px-4 py-3 text-sm text-gray-600">
                  {breakdown.extraPages > 0
                    ? `${breakdown.extraPages} extra page${breakdown.extraPages > 1 ? 's' : ''} at ${money(
                        PER_PAGE,
                      )} each.`
                    : 'No extra pages — you’re within the included count.'}
                </p>
              </Step>
            )}

            {/* Step 3 — Features */}
            {step === 2 && (
              <Step
                title="Any extra features?"
                subtitle="Add anything you need, skip what you don't."
                icon={<SparklesIcon className="text-brand-600" width={22} height={22} />}
              >
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
                        <span className="shrink-0 text-xs font-semibold text-gray-400">
                          +{money(f.price)}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </Step>
            )}

            {/* Step 4 — Support */}
            {step === 3 && (
              <Step
                title="Ongoing care?"
                subtitle="Pick a monthly care plan. Managed hosting and a free SSL certificate are included in every plan."
                icon={<LifeBuoyIcon className="text-brand-600" width={22} height={22} />}
              >
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
                            : 'border-gray-200 bg-white/60 hover:border-gray-300 hover:-translate-y-0.5'
                        }`}
                      >
                        <div className="font-bold text-gray-900">{c.label}</div>
                        <div className="mt-1 text-lg font-bold text-brand-600">
                          {money(c.monthly)}
                          <span className="text-sm font-medium text-gray-400">/mo</span>
                        </div>
                        <div className="mt-1 text-xs text-gray-500">{c.blurb}</div>
                      </button>
                    )
                  })}
                </div>

                {/* Domain — the one item billed on top of the plan */}
                <div className="mt-6 border-t border-gray-200 pt-5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <GlobeIcon className="text-brand-600" width={18} height={18} />
                    Do you already have a domain?
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {[
                      { value: true, title: 'I have a domain', note: 'No extra charge' },
                      { value: false, title: 'I need one', note: "Charged separately, I'll quote it" },
                    ].map((opt) => {
                      const active = hasDomain === opt.value
                      return (
                        <button
                          key={opt.title}
                          type="button"
                          onClick={() => setHasDomain(opt.value)}
                          aria-pressed={active}
                          className={`flex flex-col rounded-xl border p-4 text-left transition ${
                            active
                              ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500/20'
                              : 'border-gray-200 bg-white/60 hover:border-gray-300'
                          }`}
                        >
                          <div className="font-bold text-gray-900">{opt.title}</div>
                          <div className="mt-1 text-xs text-gray-500">{opt.note}</div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <p className="mt-4 flex items-start gap-2 text-xs text-gray-400">
                  <ShieldCheckIcon className="mt-0.5 shrink-0 text-brand-500" width={14} height={14} />
                  {HOSTING_NOTE}
                </p>
              </Step>
            )}

            {/* Step 5 — Breakdown */}
            {step === 4 && (
              <Step
                title="Your estimate"
                subtitle="An itemised breakdown. Not binding — I'll confirm it after a quick chat."
                icon={<CheckIcon className="text-brand-600" width={22} height={22} />}
              >
                {/* Your build — recap of every selection */}
                <div className="rounded-xl border border-gray-200 bg-white/70 p-5">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600">
                    <SparklesIcon width={15} height={15} />
                    Your build
                  </div>
                  <dl className="mt-4 space-y-3 text-sm">
                    <SummaryRow label="Project">
                      <span className="font-semibold text-gray-900">{type.label}</span>
                    </SummaryRow>
                    <SummaryRow label="Pages">
                      <span className="font-semibold text-gray-900">{pages}</span>
                    </SummaryRow>
                    <SummaryRow label="Features">
                      {chosenFeatures.length ? (
                        <span className="font-semibold text-gray-900">
                          {chosenFeatures.length} added
                        </span>
                      ) : (
                        <span className="text-gray-400">None</span>
                      )}
                    </SummaryRow>
                    <SummaryRow label="Care plan">
                      <span className="font-semibold text-gray-900">{care.label}</span>
                    </SummaryRow>
                    <SummaryRow label="Domain">
                      <span className="font-semibold text-gray-900">
                        {hasDomain ? 'I have one' : 'Need one'}
                      </span>
                    </SummaryRow>
                  </dl>
                  {chosenFeatures.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {chosenFeatures.map((f) => (
                        <span
                          key={f.key}
                          className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-700"
                        >
                          {f.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Totals */}
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
                  Estimate only. Your exact price depends on the details — I'll confirm it after a
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

            {/* Nav footer (hidden on final step — CTAs live in the breakdown) */}
            {!isLast && (
              <div className="mt-7 flex items-center justify-between gap-4 border-t border-gray-200 pt-5">
                <button
                  type="button"
                  onClick={back}
                  disabled={step === 0}
                  className="btn-secondary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Back
                </button>
                <button type="button" onClick={next} className="btn-primary">
                  {step === STEPS.length - 2 ? 'See quote' : 'Next'}
                  <ArrowRightIcon className="ml-2" width={18} height={18} />
                </button>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  )
}

/** A label / value row used in the build recap. */
function SummaryRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-gray-400">{label}</dt>
      <dd className="text-right">{children}</dd>
    </div>
  )
}

/** Consistent step header (with a small icon chip) + body wrapper. */
function Step({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-start gap-3">
        {icon && (
          <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-50">
            {icon}
          </span>
        )}
        <div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="mb-5 mt-1 text-sm text-gray-500">{subtitle}</p>}
          {!subtitle && <div className="mb-5" />}
        </div>
      </div>
      {children}
    </div>
  )
}
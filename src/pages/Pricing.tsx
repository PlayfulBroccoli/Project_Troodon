import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { whatsappLink } from '../config/site'
import { CheckIcon, ArrowRightIcon, WhatsAppIcon } from '../components/icons'

/**
 * Pricing page — an interactive quote *estimator*. Pricing is quote-based, not
 * fixed-tier, so this produces an estimated range and always ends in a real
 * "Get a Quote" action. Tune the numbers below to your rates.
 *
 * All amounts are one-off estimates in the currency set by CURRENCY.
 */

const CURRENCY = 'RM'

type Priced = { key: string; label: string; low: number; high: number }

const projectTypes: (Priced & { includedPages: number; blurb: string })[] = [
  { key: 'landing', label: 'Landing page', low: 800, high: 1500, includedPages: 1, blurb: 'One focused, high-converting page' },
  { key: 'business', label: 'Business website', low: 2000, high: 3500, includedPages: 5, blurb: 'Multi-page site for a small business' },
  { key: 'webapp', label: 'Web app', low: 5000, high: 12000, includedPages: 3, blurb: 'Custom tool, dashboard or booking system' },
]

const perPage = { low: 150, high: 300 }

const featureList: Priced[] = [
  { key: 'booking', label: 'Booking / scheduling', low: 600, high: 1200 },
  { key: 'ecommerce', label: 'E-commerce / payments', low: 1500, high: 3500 },
  { key: 'cms', label: 'Editable content (CMS)', low: 800, high: 1500 },
  { key: 'auth', label: 'User accounts / login', low: 1000, high: 2500 },
  { key: 'seo', label: 'SEO boost', low: 400, high: 900 },
  { key: 'copywriting', label: 'Copywriting', low: 300, high: 800 },
  { key: 'branding', label: 'Logo / branding', low: 500, high: 1200 },
  { key: 'hosting', label: 'Hosting & maintenance (first year)', low: 400, high: 800 },
]

const MIN_PAGES = 1
const MAX_PAGES = 15

/** Round to the nearest 50 for a tidier-looking estimate. */
const round50 = (n: number) => Math.round(n / 50) * 50
const money = (n: number) => `${CURRENCY} ${n.toLocaleString('en-MY')}`

export function Pricing() {
  const [typeKey, setTypeKey] = useState('business')
  const [pages, setPages] = useState(5)
  const [selected, setSelected] = useState<Record<string, boolean>>({})

  const type = projectTypes.find((t) => t.key === typeKey)!

  const estimate = useMemo(() => {
    const extraPages = Math.max(0, pages - type.includedPages)
    let low = type.low + extraPages * perPage.low
    let high = type.high + extraPages * perPage.high
    for (const f of featureList) {
      if (selected[f.key]) {
        low += f.low
        high += f.high
      }
    }
    return { low: round50(low), high: round50(high), extraPages }
  }, [type, pages, selected])

  const chosenFeatures = featureList.filter((f) => selected[f.key])

  /** Prefilled WhatsApp message summarising the estimate. */
  const waMessage = useMemo(() => {
    const feats = chosenFeatures.length
      ? chosenFeatures.map((f) => f.label).join(', ')
      : 'none selected'
    return (
      `Hi! I used the quote calculator and got an estimate of ` +
      `${money(estimate.low)}–${money(estimate.high)}.\n` +
      `Project: ${type.label}\nPages: ${pages}\nFeatures: ${feats}\n` +
      `I'd like an exact quote please.`
    )
  }, [type, pages, chosenFeatures, estimate])

  const toggle = (key: string) => setSelected((s) => ({ ...s, [key]: !s[key] }))

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="mx-auto max-w-3xl px-6 pt-16 pb-10 text-center">
        <span className="badge mb-5 inline-block">Pricing</span>
        <h1 className="mb-4 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
          Get a ballpark in seconds
        </h1>
        <p className="mx-auto max-w-xl text-lg text-gray-500">
          Every project is priced individually — no fixed tiers. Build your project below for an
          instant estimate, then get an exact, itemised quote.
        </p>
      </section>

      {/* ---------- Calculator ---------- */}
      <section className="mx-auto max-w-6xl px-6 pb-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Controls */}
          <div className="space-y-6 lg:col-span-2">
            {/* Project type */}
            <div className="card-glass p-6 sm:p-8">
              <h2 className="mb-1 text-lg font-bold text-gray-900">1. Project type</h2>
              <p className="mb-4 text-sm text-gray-500">What are we building?</p>
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
                        from {money(t.low)}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Pages */}
            <div className="card-glass p-6 sm:p-8">
              <div className="flex items-baseline justify-between">
                <h2 className="text-lg font-bold text-gray-900">2. Number of pages</h2>
                <span className="text-2xl font-bold text-brand-600">{pages}</span>
              </div>
              <p className="mb-4 text-sm text-gray-500">
                {type.includedPages} included with a {type.label.toLowerCase()};{' '}
                {estimate.extraPages > 0
                  ? `${estimate.extraPages} extra at ~${money(perPage.low)}–${money(perPage.high)} each.`
                  : 'no extra pages yet.'}
              </p>
              <input
                type="range"
                min={MIN_PAGES}
                max={MAX_PAGES}
                value={pages}
                onChange={(e) => setPages(Number(e.target.value))}
                aria-label="Number of pages"
                className="w-full accent-brand-600"
              />
              <div className="mt-1 flex justify-between text-xs text-gray-400">
                <span>{MIN_PAGES}</span>
                <span>{MAX_PAGES}+</span>
              </div>
            </div>

            {/* Features */}
            <div className="card-glass p-6 sm:p-8">
              <h2 className="mb-1 text-lg font-bold text-gray-900">3. Features</h2>
              <p className="mb-4 text-sm text-gray-500">Pick anything you need — add-ons are estimated.</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {featureList.map((f) => {
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
                      <span className="shrink-0 text-xs text-gray-400">+{money(f.low)}</span>
                    </label>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Estimate summary (sticky on desktop) */}
          <div className="lg:col-span-1">
            <div className="card-glass sticky top-24 p-6 sm:p-8">
              <div className="text-xs font-bold uppercase tracking-wider text-brand-600">
                Estimated range
              </div>
              <div className="mt-2 text-3xl font-bold leading-tight text-gray-900">
                {money(estimate.low)}
                <span className="text-gray-400"> – </span>
                {money(estimate.high)}
              </div>
              <p className="mt-2 text-xs text-gray-400">
                A rough estimate, not a quote. Your exact price depends on the details — I'll confirm
                it after a quick chat.
              </p>

              <div className="my-5 space-y-2 border-y border-gray-200 py-4 text-sm">
                <Row label={type.label} />
                <Row label={`${pages} page${pages > 1 ? 's' : ''}`} />
                {chosenFeatures.map((f) => (
                  <Row key={f.key} label={f.label} />
                ))}
                {chosenFeatures.length === 0 && (
                  <div className="text-xs text-gray-400">No add-ons selected.</div>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <Link to="/contact" className="btn-primary w-full">
                  Get an exact Quote
                  <ArrowRightIcon className="ml-2" width={18} height={18} />
                </Link>
                <a
                  href={whatsappLink(waMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp w-full"
                >
                  <WhatsAppIcon width={18} height={18} />
                  Send estimate on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Package comparison ---------- */}
      <section className="mx-auto max-w-5xl px-6 pb-8 pt-4">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <div className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-600">
            Compare
          </div>
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">What each package includes</h2>
          <p className="mt-2 text-gray-500">Typical starting points — every project is tailored.</p>
        </div>
        <div className="card-glass overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="p-4 font-medium">Feature</th>
                {projectTypes.map((t) => (
                  <th key={t.key} className="p-4 text-center font-bold text-gray-900">
                    {t.label}
                    <div className="text-xs font-medium text-brand-600">from {money(t.low)}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {comparisonRows.map((row) => (
                <tr key={row.label} className="border-b border-gray-100 last:border-0">
                  <td className="p-4 font-medium text-gray-700">{row.label}</td>
                  {(['landing', 'business', 'webapp'] as const).map((k) => (
                    <td key={k} className="p-4 text-center">
                      {typeof row[k] === 'boolean' ? (
                        row[k] ? (
                          <CheckIcon
                            className="mx-auto text-brand-600"
                            width={18}
                            height={18}
                          />
                        ) : (
                          <span className="text-gray-300">—</span>
                        )
                      ) : (
                        <span className="text-gray-600">{row[k]}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ---------- CTA band ---------- */}
      <section className="mx-auto max-w-5xl px-6 pb-20 pt-8">
        <div className="card-glass overflow-hidden p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Ready for an exact price?</h2>
          <p className="mx-auto mt-2 max-w-md text-gray-500">
            Send your details and I'll turn your estimate into a firm, itemised quote — usually
            within a day.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/contact" className="btn-primary w-full sm:w-auto">
              Get a Quote
            </Link>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp w-full sm:w-auto"
            >
              <WhatsAppIcon width={18} height={18} />
              WhatsApp me
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

function Row({ label }: { label: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <CheckIcon className="mt-0.5 shrink-0 text-brand-600" width={15} height={15} />
      <span className="text-gray-700">{label}</span>
    </div>
  )
}

type ComparisonRow = {
  label: string
  landing: boolean | string
  business: boolean | string
  webapp: boolean | string
}

const comparisonRows: ComparisonRow[] = [
  { label: 'Pages', landing: '1', business: 'up to ~8', webapp: 'custom' },
  { label: 'Custom design', landing: true, business: true, webapp: true },
  { label: 'Mobile-first', landing: true, business: true, webapp: true },
  { label: 'Contact / enquiry form', landing: true, business: true, webapp: true },
  { label: 'Booking system', landing: false, business: true, webapp: true },
  { label: 'CMS (edit it yourself)', landing: false, business: true, webapp: true },
  { label: 'Database & user accounts', landing: false, business: false, webapp: true },
  { label: 'Hosting & maintenance', landing: 'optional', business: 'optional', webapp: 'included' },
  { label: 'Typical timeline', landing: 'days', business: '1–3 weeks', webapp: 'scoped' },
]

import { Link } from 'react-router-dom'
import { CheckIcon, ArrowRightIcon } from '../components/icons'
import { Reveal } from '../components/Reveal'
import {
  projectTypes,
  carePlans,
  comparisonRows,
  money,
  HOSTING_NOTE,
} from '../config/pricing'

/**
 * Pricing page — the STATIC overview: plan cards + a comparison table so a
 * visitor can size up the options at a glance. The interactive, itemised
 * estimator lives on /quote. Pricing is quote-based, so every figure is a
 * "from" starting point, not a fixed tier. Cards mirror the Home service
 * cards so the two pages feel like one site.
 */

export function Pricing() {
  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="mx-auto max-w-3xl px-6 pt-16 pb-12 text-center">
        <span className="badge mb-5 inline-block">Pricing</span>
        <h1 className="mb-4 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
          Simple, project-based pricing
        </h1>
        <p className="mx-auto max-w-xl text-lg text-gray-500">
          No fixed tiers. Every project is quoted on what it actually needs. Here's where each type
          of project starts, plus a monthly care plan to keep it running.
        </p>
      </section>

      {/* ---------- Plan cards ---------- */}
      <section className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {projectTypes.map((p, i) => (
            <Reveal key={p.key} delay={i * 120} className="h-full">
              <div
                className={`card-glass relative flex h-full flex-col p-6 ${
                  p.featured ? 'border-brand-500 ring-1 ring-brand-500/20' : ''
                }`}
              >
                {p.featured && (
                  <div className="badge absolute -top-3 left-1/2 -translate-x-1/2">Most popular</div>
                )}
                <h3 className="text-xl font-bold text-gray-900">{p.label}</h3>
                <p className="mt-1 text-sm text-gray-500">{p.blurb}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-xs font-medium text-gray-400">from</span>
                  <span className="text-3xl font-bold text-gray-900">{money(p.base)}</span>
                </div>
                <div className="mt-1 text-xs text-gray-400">one-off build</div>
                <ul className="mt-4 flex-1 space-y-2.5 border-t border-gray-200 pt-4 text-sm">
                  {p.points.map((pt) => (
                    <li key={pt.lead} className="flex items-start gap-2.5">
                      <CheckIcon className="mt-0.5 shrink-0 text-brand-600" width={16} height={16} />
                      <span className="text-gray-700">
                        <span className="font-semibold text-gray-900">{pt.lead}</span> {pt.detail}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/quote"
                  className={`mt-5 ${p.featured ? 'btn-primary' : 'btn-secondary'} w-full`}
                >
                  Build a quote
                  <ArrowRightIcon className="ml-2" width={18} height={18} />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-gray-500">
          Not sure what you need?{' '}
          <Link to="/quote" className="font-medium text-brand-600 hover:text-brand-800">
            Build an instant estimate →
          </Link>
        </p>
      </section>

      {/* ---------- Care plans ---------- */}
      <section className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
        <Reveal>
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <div className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-600">
              Ongoing support
            </div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Monthly care plans</h2>
            <p className="mt-2 text-gray-500">
              Pick a plan and I keep your site secure, backed up, and up to date, so you can focus on
              your business. Management and support only. Hosting is billed separately at cost.
            </p>
          </div>
        </Reveal>
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
          {carePlans.map((c, i) => (
            <Reveal key={c.key} delay={i * 120} className="h-full">
              <div className="card-glass flex h-full flex-col p-6">
                <h3 className="text-lg font-bold text-gray-900">{c.label}</h3>
                <p className="mt-1 text-sm text-gray-500">{c.blurb}</p>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-gray-900">
                    {money(c.monthly)}
                    <span className="text-base font-medium text-gray-400"> /mo</span>
                  </span>
                </div>
                <ul className="mt-5 flex-1 space-y-2.5 border-t border-gray-200 pt-5 text-sm">
                  {c.includes.map((inc) => (
                    <li key={inc} className="flex items-start gap-2.5">
                      <CheckIcon className="mt-0.5 shrink-0 text-brand-600" width={16} height={16} />
                      <span className="text-gray-700">{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-gray-400">{HOSTING_NOTE}</p>
      </section>

      {/* ---------- Comparison table ---------- */}
      <section className="mx-auto max-w-5xl px-6 py-12 pb-24 sm:py-16 sm:pb-28">
        <Reveal>
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <div className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-600">
              Compare
            </div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              What each package includes
            </h2>
            <p className="mt-2 text-gray-500">Typical starting points. Every project is tailored.</p>
          </div>
        </Reveal>
        <Reveal>
          <div className="card-glass overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <th className="p-4 font-medium">Feature</th>
                  {projectTypes.map((t) => (
                    <th key={t.key} className="p-4 text-center font-bold text-gray-900">
                      {t.label}
                      <div className="text-xs font-medium text-brand-600">from {money(t.base)}</div>
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
                            <CheckIcon className="mx-auto text-brand-600" width={18} height={18} />
                          ) : (
                            <span className="text-gray-300">–</span>
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
        </Reveal>
      </section>
    </>
  )
}

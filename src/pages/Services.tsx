import { Link } from 'react-router-dom'
import { whatsappLink } from '../config/site'
import { CheckIcon, ArrowRightIcon, WhatsAppIcon } from '../components/icons'

/**
 * Services page — expands the three service shapes from Home into detailed
 * sections (what's included + a typical timeline) with a per-service CTA.
 * Copy patterns from Home.tsx; no new visual styles.
 */

type Service = {
  key: string
  title: string
  tagline: string
  blurb: string
  includes: string[]
  timeline: string
  featured?: boolean
}

const servicesList: Service[] = [
  {
    key: 'landing',
    title: 'Landing Pages',
    tagline: 'Launch fast',
    blurb:
      'A single, high-converting page to launch a product, campaign, or event, designed to turn visitors into enquiries.',
    includes: [
      'Custom design + build',
      'Mobile-first, fast-loading',
      'One clear call-to-action',
      'Contact form or WhatsApp link',
      'Basic on-page SEO',
    ],
    timeline: 'Typically live in a few days',
  },
  {
    key: 'business',
    title: 'Business Websites',
    tagline: 'Look legit',
    blurb:
      'A multi-page site with everything a small business needs to build trust and get found, from services to contact and booking.',
    includes: [
      'Up to ~8 pages',
      'Services, About, Contact & more',
      'Enquiry form + booking',
      'SEO basics + social/OG tags',
      'Hosting & domain setup',
    ],
    timeline: 'Usually 1–3 weeks',
    featured: true,
  },
  {
    key: 'webapp',
    title: 'Web Apps',
    tagline: 'Custom tools',
    blurb:
      'Custom tools, dashboards, and booking systems built on a modern stack, for when a brochure site is not enough.',
    includes: [
      'React / Node on a modern stack',
      'Database + user authentication',
      'Admin dashboards & custom flows',
      'Hosted & maintained on your VPS',
      'Ongoing support available',
    ],
    timeline: 'Scoped per project',
  },
]

export function Services() {
  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="mx-auto max-w-3xl px-6 pt-16 pb-12 text-center">
        <span className="badge mb-5 inline-block">Services</span>
        <h1 className="mb-4 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
          What I can build for you
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-lg text-gray-500">
          Every project is custom-quoted, and these are the shapes most take. Not sure which fits?
          Tell me the idea and I'll point you the right way.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/contact" className="btn-primary w-full sm:w-auto">
            Get a Quote
            <ArrowRightIcon className="ml-2" width={18} height={18} />
          </Link>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp w-full sm:w-auto"
          >
            <WhatsAppIcon width={18} height={18} />
            Chat on WhatsApp
          </a>
        </div>
      </section>

      {/* ---------- Detailed service sections ---------- */}
      <section className="mx-auto max-w-5xl px-6 pb-8">
        <div className="space-y-6">
          {servicesList.map((s) => (
            <div
              key={s.key}
              className={`card-glass p-6 sm:p-8 ${
                s.featured ? 'border-brand-500 ring-1 ring-brand-500/20' : ''
              }`}
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
                {/* Left: intro */}
                <div className="md:col-span-2">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-brand-600">
                      {s.tagline}
                    </div>
                    {s.featured && <span className="badge">Most popular</span>}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{s.title}</h2>
                  <p className="mt-2 text-gray-500">{s.blurb}</p>
                  <p className="mt-4 text-sm font-medium text-gray-600">
                    <span className="text-brand-600">Timeline:</span> {s.timeline}
                  </p>
                </div>

                {/* Right: what's included + CTA */}
                <div className="md:col-span-3 md:border-l md:border-gray-200 md:pl-8">
                  <div className="mb-3 text-sm font-bold text-gray-900">What's included</div>
                  <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {s.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <CheckIcon
                          className="mt-0.5 shrink-0 text-brand-600"
                          width={16}
                          height={16}
                        />
                        <span className="text-sm text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/contact"
                    className={`mt-6 ${s.featured ? 'btn-primary' : 'btn-secondary'} w-full sm:w-auto`}
                  >
                    Get a Quote for {s.title}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- CTA band ---------- */}
      <section className="mx-auto max-w-5xl px-6 pb-20 pt-8">
        <div className="card-glass overflow-hidden p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Not sure what you need?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-gray-500">
            Send over your idea and I'll recommend the right approach, with an itemised quote,
            usually within a day.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/pricing" className="btn-primary w-full sm:w-auto">
              Try the quote calculator
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

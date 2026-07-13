import { Link } from 'react-router-dom'
import { site, whatsappLink } from '../config/site'
import { CheckIcon, ArrowRightIcon, WhatsAppIcon } from '../components/icons'
import { Testimonials } from '../components/Testimonials'

/**
 * Home / landing page. This is the ONE reference page for the site.
 * It intentionally exercises every shared pattern (hero, glass cards,
 * badges, primary/secondary/WhatsApp buttons, section headers, CTA band)
 * so the next agent can copy patterns rather than invent them.
 */

const services = [
  {
    title: 'Landing Pages',
    desc: 'A single, high-converting page to launch your product or campaign — fast.',
    points: ['Design + build', 'Mobile-first', 'Live in days'],
  },
  {
    title: 'Business Websites',
    desc: 'Multi-page sites with everything a small business needs to look legit.',
    points: ['Up to 8 pages', 'Contact + booking', 'SEO basics'],
    featured: true,
  },
  {
    title: 'Web Apps',
    desc: 'Custom tools, dashboards, and booking systems built on a modern stack.',
    points: ['React / Node', 'Database + auth', 'Hosted on your VPS'],
  },
]

const steps = [
  { n: '1', title: 'Tell me the scope', desc: 'Share your idea via WhatsApp or the enquiry form.' },
  { n: '2', title: 'Get a quote', desc: 'A clear, itemised price — no fixed tiers, no surprises.' },
  { n: '3', title: 'Book a call', desc: "I'll lock the details on a short call, then start building." },
]

export function Home() {
  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="mx-auto max-w-3xl px-6 pt-16 pb-14 text-center">
        <span className="badge mb-5 inline-block">Freelance web developer</span>
        <h1 className="mb-4 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
          Websites that mean business.
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-lg text-gray-500">
          {site.name} designs, builds, and hosts fast, modern websites for small businesses —
          from landing pages to full web apps. Priced per project, quoted in minutes.
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

      {/* ---------- Services ---------- */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <SectionHeading
          eyebrow="What I build"
          title="Pick a starting point"
          subtitle="Every project is custom-quoted. These are the shapes most projects take."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {services.map((s) => (
            <div
              key={s.title}
              className={`card-glass relative flex flex-col p-6 ${
                s.featured ? 'border-brand-500 ring-1 ring-brand-500/20' : ''
              }`}
            >
              {s.featured && (
                <div className="badge absolute -top-3 left-1/2 -translate-x-1/2">Most popular</div>
              )}
              <h3 className="text-xl font-bold text-gray-900">{s.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{s.desc}</p>
              <ul className="mt-4 flex-1 space-y-2.5 border-t border-gray-200 pt-4 text-sm">
                {s.points.map((p) => (
                  <li key={p} className="flex items-start gap-2.5">
                    <CheckIcon className="mt-0.5 shrink-0 text-brand-600" width={16} height={16} />
                    <span className="text-gray-700">{p}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className={`mt-5 ${s.featured ? 'btn-primary' : 'btn-secondary'} w-full`}
              >
                Get a Quote
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section className="mx-auto max-w-5xl px-6 pb-16">
        <SectionHeading eyebrow="How it works" title="From idea to launch in three steps" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="card-glass p-6">
              <div className="mb-3 grid h-10 w-10 place-items-center rounded-full bg-brand-600 text-lg font-bold text-white">
                {s.n}
              </div>
              <h3 className="font-bold text-gray-900">{s.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Testimonials ---------- */}
      <Testimonials />

      {/* ---------- CTA band ---------- */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="card-glass overflow-hidden p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Ready to see a quote?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-gray-500">
            Send over your idea and get an itemised price — usually within a day.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/contact" className="btn-primary w-full sm:w-auto">
              Start an enquiry
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

/** Centered section heading used across the site. */
function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
}) {
  return (
    <div className="mx-auto mb-8 max-w-2xl text-center">
      {eyebrow && (
        <div className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-600">
          {eyebrow}
        </div>
      )}
      <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">{title}</h2>
      {subtitle && <p className="mt-2 text-gray-500">{subtitle}</p>}
    </div>
  )
}

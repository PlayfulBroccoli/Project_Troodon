import { Link } from 'react-router-dom'
import { whatsappLink } from '../config/site'
import { ArrowRightIcon, ExternalLinkIcon, WhatsAppIcon } from '../components/icons'

/**
 * Portfolio page — a card-glass gallery of past work.
 *
 * Replace the placeholder `projects` below with real case studies. Each thumbnail
 * uses a simple gradient placeholder; swap `image` for a real screenshot path
 * (drop files in /public and reference them as "/portfolio/your-shot.png").
 */

type Project = {
  title: string
  blurb: string
  tags: string[]
  href?: string // live link, if public (external)
  to?: string // internal demo route (rendered as a <Link>)
  image?: string // optional screenshot path in /public
}

const projects: Project[] = [
  {
    title: 'Kuali Kitchen — ordering & live kitchen',
    blurb:
      'A two-sided restaurant demo: guests scan a per-table QR to order; the kitchen board fills live in real time, with order statuses and 86-ing dishes that sync back to every menu. No backend — cross-tab sync via BroadcastChannel.',
    tags: ['Business site', 'Ordering', 'Scan-to-order', 'Live sync', 'React'],
    to: '/demos/restaurant',
  },
  {
    title: 'Klinik Sri Sentosa — appointment booking',
    blurb:
      'A two-sided clinic demo: patients book a slot with a chosen doctor; the reception board fills live as patients check in, get called in, and complete visits. A doctor roster toggles days off that instantly hide their booking slots. No backend — cross-tab sync via BroadcastChannel.',
    tags: ['Business site', 'Appointments', 'Two-sided', 'Live sync', 'React'],
    to: '/demos/clinic',
  },
  {
    title: 'Sample Launch: Landing Page',
    blurb:
      'Placeholder. A single high-converting landing page for a product launch, live in three days.',
    tags: ['Landing page', 'Conversion'],
  },
  {
    title: 'Sample Studio: Portfolio Site',
    blurb: 'Placeholder. A clean portfolio + enquiry site for a creative studio.',
    tags: ['Portfolio', 'CMS'],
  },
  {
    title: 'Sample Booking Tool: Web App',
    blurb:
      'Placeholder. A custom booking dashboard with authentication, hosted on the client’s VPS.',
    tags: ['Web app', 'React / Node', 'Auth'],
  },
]

export function Portfolio() {
  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="mx-auto max-w-3xl px-6 pt-16 pb-12 text-center">
        <span className="badge mb-5 inline-block">Portfolio</span>
        <h1 className="mb-4 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
          A few things I've built
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-lg text-gray-500">
          A selection of recent projects. Want something similar? Tell me the idea and I'll send
          back a quote.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/contact" className="btn-primary w-full sm:w-auto">
            Start a project
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

      {/* ---------- Gallery ---------- */}
      <section className="mx-auto max-w-6xl px-6 pb-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {projects.map((p) => (
            <article key={p.title} className="card-glass flex flex-col overflow-hidden">
              {/* Thumbnail */}
              <div className="relative aspect-[16/9] overflow-hidden border-b border-gray-200">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-gradient-to-br from-brand-50 to-brand-100">
                    <span className="text-3xl font-black text-brand-600/40">
                      {p.title.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col p-6">
                <h2 className="text-lg font-bold text-gray-900">{p.title}</h2>
                <p className="mt-1 flex-1 text-sm text-gray-500">{p.blurb}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                {p.to && (
                  <Link
                    to={p.to}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 transition hover:text-brand-800"
                  >
                    View live demo
                    <ArrowRightIcon width={15} height={15} />
                  </Link>
                )}
                {p.href && (
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 transition hover:text-brand-800"
                  >
                    Visit site
                    <ExternalLinkIcon width={15} height={15} />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ---------- CTA band ---------- */}
      <section className="mx-auto max-w-5xl px-6 pb-20 pt-8">
        <div className="card-glass overflow-hidden p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Your project could be next
          </h2>
          <p className="mx-auto mt-2 max-w-md text-gray-500">
            Tell me what you have in mind and I'll send an itemised quote, usually within a day.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/quote" className="btn-primary w-full sm:w-auto">
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

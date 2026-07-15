import { Link } from 'react-router-dom'
import { site, whatsappLink } from '../config/site'
import { CheckIcon, ArrowRightIcon, WhatsAppIcon } from '../components/icons'

/**
 * About page — the one person behind {site.name}.
 *
 * All personal copy lives in the `me` block below so it's easy to edit in one
 * place. Replace the TODO placeholders with real details, then delete this note.
 */
const me = {
  name: 'Nick', // TODO: your name as you want it shown
  role: 'Freelance web developer',
  location: 'Malaysia', // TODO: where you're based (or remove)
  // A short punchy intro for the hero.
  intro:
    "I'm a solo web developer who designs, builds, and hosts fast, modern websites " +
    'for small businesses, everything from a single landing page to a full web app. ' +
    'You work directly with me, start to finish. No account managers, no hand-offs.',
  // A slightly longer story / background paragraph.
  story:
    'TODO: A couple of sentences on your background, how you got into building ' +
    'websites, what you enjoy about it, and the kind of clients you like working with.',
  // Things you do / skills to highlight.
  skills: [
    'Design + front-end (React, TypeScript, Tailwind)',
    'Back-end & APIs (Node, databases, auth)',
    'Hosting, deployment & maintenance on a VPS',
    'Booking systems, dashboards & custom tools',
    'SEO basics & performance',
  ],
  // Short "why work with me" points, each a title + blurb.
  values: [
    {
      title: 'One point of contact',
      desc: "You talk to the person actually building your site, not a sales team.",
    },
    {
      title: 'Honest, itemised pricing',
      desc: 'Quote-based and transparent. You see what you pay for, no fixed tiers.',
    },
    {
      title: 'Built to last',
      desc: 'Modern stack, clean code, and hosting I can maintain long after launch.',
    },
  ],
}

export function About() {
  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="mx-auto max-w-3xl px-6 pt-16 pb-14 text-center">
        <span className="badge mb-5 inline-block">About {site.name}</span>
        <h1 className="mb-4 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
          Hi, I'm {me.name}.
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-lg text-gray-500">{me.intro}</p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/contact" className="btn-primary w-full sm:w-auto">
            Work with me
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

      {/* ---------- Story + skills ---------- */}
      <section className="mx-auto max-w-5xl px-6 pb-16">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="card-glass p-6 sm:p-8">
            <div className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-600">
              {me.role}
              {me.location ? ` · ${me.location}` : ''}
            </div>
            <h2 className="mb-3 text-2xl font-bold text-gray-900">A bit about me</h2>
            <p className="text-gray-500">{me.story}</p>
          </div>
          <div className="card-glass p-6 sm:p-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">What I do</h2>
            <ul className="space-y-2.5 text-sm">
              {me.skills.map((s) => (
                <li key={s} className="flex items-start gap-2.5">
                  <CheckIcon className="mt-0.5 shrink-0 text-brand-600" width={16} height={16} />
                  <span className="text-gray-700">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- Why work with me ---------- */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <div className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-600">
            Why work with me
          </div>
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Small studio feel, one person's care
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {me.values.map((v) => (
            <div key={v.title} className="card-glass p-6">
              <h3 className="font-bold text-gray-900">{v.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- CTA band ---------- */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="card-glass overflow-hidden p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Got a project in mind?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-gray-500">
            Tell me what you're building and I'll send back an itemised quote, usually within a day.
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

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { site, whatsappLink } from '../config/site'
import { projectTypes } from '../config/pricing'
import { CheckIcon, ArrowRightIcon, WhatsAppIcon } from '../components/icons'
import { Reveal } from '../components/Reveal'

/**
 * Home / landing page. This is the ONE reference page for the site.
 * It intentionally exercises every shared pattern (hero, glass cards,
 * badges, primary/secondary/WhatsApp buttons, section headers, CTA band)
 * so the next agent can copy patterns rather than invent them.
 */

/**
 * Home service cards read from the shared `projectTypes` config so their
 * titles and bullets always match the Pricing page and Quote wizard.
 */
const services = projectTypes

const steps = [
  {
    n: '1',
    title: 'Tell me the scope',
    desc: 'Share your idea over WhatsApp or the enquiry form. Attach links or screenshots of anything that inspires you. The more detail, the better.',
  },
  {
    n: '2',
    title: 'I start building',
    desc: 'I turn your idea into a working prototype so you can see it for real. Completely free, with no commitment.',
  },
  {
    n: '3',
    title: 'Get a quote',
    desc: 'You get a clear, itemised breakdown of every cost. Nothing hidden, and every price is negotiable.',
  },
  {
    n: '4',
    title: 'You call the shots',
    desc: "We lock the details over a call, meeting, or in person. Then you decide if you'd like to proceed, with no pressure.",
  },
  {
    n: '5',
    title: 'Secure your build',
    desc: 'A 30% deposit reserves your slot and kicks off the full build.',
  },
  {
    n: '6',
    title: 'Review & launch',
    desc: 'You see the finished product and sign off on everything before it goes live.',
  },
]

/**
 * Example tabs — each shows a real screenshot of a site of that type.
 * Drop images into src/assets/showcase named <key>.png|jpg|webp and they're
 * picked up automatically (see `screenshots` below). `url` is the address
 * shown in the fake browser bar.
 */
const examples = [
  { key: 'landing', tag: 'Landing page', url: 'yourbrand.com' },
  { key: 'business', tag: 'Business website', url: 'yourbusiness.com' },
  { key: 'webapp', tag: 'Web app', url: 'app.yourtool.com' },
]

/**
 * Auto-collect any screenshot in src/assets/showcase keyed by filename, e.g.
 * `business.png` -> screenshots['business']. Add a file and its tab lights up.
 */
const screenshotModules = import.meta.glob('../assets/showcase/*.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const screenshots: Record<string, string> = {}
for (const [path, src] of Object.entries(screenshotModules)) {
  const name = path.split('/').pop()!.replace(/\.[^.]+$/, '')
  screenshots[name] = src
}

export function Home() {
  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative mx-auto flex min-h-[100svh] max-w-3xl flex-col items-center justify-center px-6 pt-24 pb-28 text-center">
        {/* Ambient turquoise glow — one soft, centered wash behind the
            headline so it reinforces the centered layout instead of
            pulling against it. Pointer-safe, sits below content. */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-[38%] h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-300/10 blur-[120px]" />
        </div>

        <span className="badge hero-in mb-5 inline-block" style={{ animationDelay: '0ms' }}>
          Freelance web developer
        </span>
        <h1
          className="hero-in mb-3 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl"
          style={{ animationDelay: '80ms' }}
        >
          Websites that mean business.
        </h1>
        <p
          className="hero-in mb-5 text-xl font-semibold text-brand-600 sm:text-2xl"
          style={{ animationDelay: '140ms' }}
        >
          If you can think it, I can build it.
        </p>
        <p
          className="hero-in mx-auto mb-8 max-w-xl text-lg text-gray-500"
          style={{ animationDelay: '200ms' }}
        >
          {site.name} designs, builds, and hosts fast, modern websites for small businesses,
          from landing pages to full web apps. Priced per project and quoted in minutes.
        </p>
        <div
          className="hero-in flex flex-col items-center justify-center gap-3 sm:flex-row"
          style={{ animationDelay: '240ms' }}
        >
          <Link to="/quote" className="btn-primary w-full sm:w-auto">
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

        {/* Trust strip — honest promises, true from day one (no track
            record implied). Reuses CheckIcon + brand accent. */}
        <ul
          className="hero-in mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-gray-600"
          style={{ animationDelay: '340ms' }}
        >
          {['Live in days', 'Fixed quote upfront', 'One developer, start to finish'].map((point) => (
            <li key={point} className="flex items-center gap-1.5">
              <CheckIcon className="shrink-0 text-brand-600" width={16} height={16} />
              {point}
            </li>
          ))}
        </ul>

      </section>

      {/* ---------- Services ---------- */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <Reveal>
          <SectionHeading
            eyebrow="What I build"
            title="Pick a starting point"
            subtitle="Every project is custom-quoted. These are the shapes most projects take."
          />
        </Reveal>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.key} delay={i * 120} className="h-full">
              <div
                className={`card-glass relative flex h-full flex-col p-6 ${
                  s.featured ? 'border-brand-500 ring-1 ring-brand-500/20' : ''
                }`}
              >
                {s.featured && (
                  <div className="badge absolute -top-3 left-1/2 -translate-x-1/2">Most popular</div>
                )}
                <h3 className="text-xl font-bold text-gray-900">{s.label}</h3>
                <p className="mt-1 text-sm text-gray-500">{s.desc}</p>
                <ul className="mt-4 flex-1 space-y-2.5 border-t border-gray-200 pt-4 text-sm">
                  {s.points.map((p) => (
                    <li key={p.lead} className="flex items-start gap-2.5">
                      <CheckIcon className="mt-0.5 shrink-0 text-brand-600" width={16} height={16} />
                      <span className="text-gray-700">
                        <span className="font-semibold text-gray-900">{p.lead}</span> {p.detail}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/quote"
                  className={`mt-5 ${s.featured ? 'btn-primary' : 'btn-secondary'} w-full`}
                >
                  Get a Quote
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section className="mx-auto max-w-3xl px-6 py-20 sm:py-28">
        <Reveal>
          <SectionHeading
            eyebrow="How it works"
            title="From idea to launch, step by step"
            subtitle="A simple, no-pressure process. You only commit once you've seen it working."
          />
        </Reveal>
        <ol className="relative">
          {/* Vertical connecting line running through the number markers */}
          <div
            className="absolute left-5 top-5 bottom-5 w-px bg-gradient-to-b from-brand-500/50 via-brand-500/30 to-transparent"
            aria-hidden="true"
          />
          {steps.map((s, i) => (
            <li key={s.n} className="relative pb-10 last:pb-0">
              <Reveal delay={i * 90}>
                <div className="flex gap-5">
                  {/* Number marker */}
                  <div className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-600 text-lg font-bold text-white ring-4 ring-slate-50">
                    {s.n}
                  </div>
                  {/* Step card */}
                  <div className="card-glass flex-1 p-5">
                    <h3 className="font-bold text-gray-900">{s.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-500">{s.desc}</p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- Testimonials (hidden until real client quotes exist) ----------
      <Reveal>
        <Testimonials />
      </Reveal>
      */}

      {/* ---------- Examples (tabbed screenshots) ---------- */}
      <section className="mx-auto max-w-4xl px-6 py-20 sm:py-28">
        <Reveal>
          <SectionHeading eyebrow="Examples" title="Some of my work" />
        </Reveal>
        <Reveal>
          <ExamplesShowcase />
        </Reveal>
      </section>
    </>
  )
}

/** Tabbed showcase: pick a project type, see a screenshot in a browser frame. */
function ExamplesShowcase() {
  const [active, setActive] = useState(examples[0].key)
  const current = examples.find((e) => e.key === active)!
  const shot = screenshots[current.key]

  return (
    <div>
      {/* Tabs */}
      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {examples.map((ex) => {
          const on = ex.key === active
          return (
            <button
              key={ex.key}
              type="button"
              onClick={() => setActive(ex.key)}
              aria-pressed={on}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                on
                  ? 'bg-brand-600 text-white'
                  : 'border border-gray-200 bg-white/60 text-gray-600 hover:border-gray-300'
              }`}
            >
              {ex.tag}
            </button>
          )
        })}
      </div>

      {/* Browser frame around the screenshot */}
      <div className="card-glass overflow-hidden">
        {/* Chrome */}
        <div className="flex items-center gap-2 border-b border-gray-200 bg-white/70 px-4 py-2.5">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-yellow-400" />
          <span className="h-3 w-3 rounded-full bg-green-400" />
          <div className="ml-3 flex-1 truncate rounded-md bg-gray-100 px-3 py-1 text-center text-xs text-gray-400">
            {current.url}
          </div>
        </div>
        {/* Screenshot, or placeholder until one is added */}
        <div className="aspect-[16/10] bg-gradient-to-br from-slate-50 to-brand-50">
          {shot ? (
            <img
              src={shot}
              alt={`${current.tag} example`}
              className="h-full w-full object-cover object-top"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">
              Screenshot coming soon
            </div>
          )}
        </div>
      </div>
    </div>
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

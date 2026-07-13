import { QuoteIcon } from './icons'

/**
 * Reusable testimonials strip. Drop <Testimonials /> into any page.
 * Replace the placeholder quotes below with real client feedback.
 */

type Testimonial = {
  quote: string
  name: string
  company: string
}

const testimonials: Testimonial[] = [
  {
    quote:
      'Placeholder — swap for a real quote. Fast, communicative, and the site looked exactly how I pictured it. Enquiries went up within a week.',
    name: 'Client Name',
    company: 'Local Business',
  },
  {
    quote:
      'Placeholder — swap for a real quote. Dealing with one person start to finish made everything simple. No jargon, clear pricing.',
    name: 'Client Name',
    company: 'Startup',
  },
  {
    quote:
      'Placeholder — swap for a real quote. Built us a booking system that just works. Would happily recommend.',
    name: 'Client Name',
    company: 'Café',
  },
]

export function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-16">
      <div className="mx-auto mb-8 max-w-2xl text-center">
        <div className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-600">
          Testimonials
        </div>
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">What clients say</h2>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <figure key={t.name + t.company} className="card-glass flex flex-col p-6">
            <QuoteIcon className="mb-3 text-brand-500/40" width={28} height={28} />
            <blockquote className="flex-1 text-sm leading-relaxed text-gray-600">
              {t.quote}
            </blockquote>
            <figcaption className="mt-4 border-t border-gray-200 pt-4">
              <div className="text-sm font-bold text-gray-900">{t.name}</div>
              <div className="text-xs text-gray-500">{t.company}</div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { whatsappLink } from '../config/site'
import { ChevronDownIcon, WhatsAppIcon } from '../components/icons'

/**
 * FAQ page — an accessible accordion of common questions.
 * Edit the `faqs` array to add/remove questions.
 */

const faqs: { q: string; a: string }[] = [
  {
    q: 'How much does a website cost?',
    a: 'Every project is quote-based rather than fixed-tier, so the price depends on scope — number of pages, features like booking or e-commerce, and whether you need hosting. Use the quote calculator for a ballpark estimate, then I send an exact, itemised quote.',
  },
  {
    q: 'How long does it take?',
    a: 'A landing page can be live in a few days. A multi-page business site usually takes one to three weeks. Web apps are scoped per project. I always agree a timeline with you up front before starting.',
  },
  {
    q: 'How many revisions do I get?',
    a: 'Each project includes rounds of revisions so we can get the details right. The exact number is set in your quote based on scope — the goal is that you are happy with the result, not to nickel-and-dime you on changes.',
  },
  {
    q: 'Do you handle hosting and the domain?',
    a: 'Yes. I can set up hosting and connect your domain, and maintain the site afterwards. If you already have hosting, I can deploy there instead. Hosting and maintenance can be included in your quote.',
  },
  {
    q: 'How does payment work?',
    a: 'Typically a deposit to get started and the balance on completion, before the site goes live. Larger web-app projects can be split into milestones. Payment terms are laid out clearly in your quote — no hidden fees.',
  },
  {
    q: 'What do you need from me to start?',
    a: 'A rough idea of what you want, any content you already have (text, logo, images), and examples of sites you like. Do not worry if it is not all ready — we sort the details together on a short call.',
  },
  {
    q: 'Will my site work on mobile and show up on Google?',
    a: 'Always. Every site is mobile-first and fast-loading, with on-page SEO basics (titles, meta tags, sensible structure) included as standard.',
  },
  {
    q: 'Do you offer ongoing support after launch?',
    a: 'Yes — I can handle updates, fixes, and hosting on an ongoing basis. Just let me know what you need and I will include a support option in your quote.',
  },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="mx-auto max-w-3xl px-6 pt-16 pb-10 text-center">
        <span className="badge mb-5 inline-block">FAQ</span>
        <h1 className="mb-4 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
          Questions, answered
        </h1>
        <p className="mx-auto max-w-xl text-lg text-gray-500">
          The things people usually ask before starting a project. Still unsure? Just message me.
        </p>
      </section>

      {/* ---------- Accordion ---------- */}
      <section className="mx-auto max-w-3xl px-6 pb-8">
        <div className="space-y-3">
          {faqs.map((item, i) => {
            const isOpen = open === i
            const panelId = `faq-panel-${i}`
            const btnId = `faq-btn-${i}`
            return (
              <div key={item.q} className="card-glass overflow-hidden">
                <h2>
                  <button
                    type="button"
                    id={btnId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="font-bold text-gray-900">{item.q}</span>
                    <ChevronDownIcon
                      className={`shrink-0 text-brand-600 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      width={20}
                      height={20}
                    />
                  </button>
                </h2>
                {isOpen && (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={btnId}
                    className="px-6 pb-5 -mt-1 text-gray-500"
                  >
                    {item.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ---------- CTA band ---------- */}
      <section className="mx-auto max-w-5xl px-6 pb-20 pt-8">
        <div className="card-glass overflow-hidden p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Still have a question?</h2>
          <p className="mx-auto mt-2 max-w-md text-gray-500">
            Message me directly and I'll get back to you — usually the same day.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/contact" className="btn-primary w-full sm:w-auto">
              Get in touch
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

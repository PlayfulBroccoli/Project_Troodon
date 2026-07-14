import type { ReactNode } from 'react'
import { site } from '../config/site'

/**
 * Terms and Privacy pages. Deliberately plain — a single readable column in a
 * glass card. This is starter content, NOT legal advice: review and adapt it
 * (and consider a lawyer) before relying on it for a real business.
 */

const LAST_UPDATED = 'July 2026' // TODO: update when you revise these terms

function LegalLayout({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="mx-auto max-w-3xl px-6 pt-16 pb-20">
      <span className="badge mb-5 inline-block">Legal</span>
      <h1 className="mb-2 text-3xl font-bold text-gray-900 sm:text-4xl">{title}</h1>
      <p className="mb-8 text-sm text-gray-400">Last updated: {LAST_UPDATED}</p>
      <div className="card-glass space-y-6 p-6 text-gray-600 sm:p-8">{children}</div>
    </section>
  )
}

function Section({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="mb-2 text-lg font-bold text-gray-900">{heading}</h2>
      <div className="space-y-2 text-sm leading-relaxed">{children}</div>
    </div>
  )
}

export function Terms() {
  return (
    <LegalLayout title="Terms of Service">
      <p className="text-sm leading-relaxed">
        These terms cover the websites and services provided by {site.name} ({site.domain}). By
        commissioning a project, you agree to the terms below. This is starter content, so please
        adapt it to your business.
      </p>

      <Section heading="1. Scope of work">
        <p>
          The work, deliverables, timeline, and price for each project are defined in the quote you
          receive and approve. Anything outside that agreed scope may require a new or revised
          quote.
        </p>
      </Section>

      <Section heading="2. Quotes & payment">
        <p>
          Pricing is quote-based, not fixed-tier. Quotes are valid for the period stated in them.
          Unless agreed otherwise, a deposit is payable before work begins and the balance is due on
          completion, before the site goes live. Larger projects may be split into milestones.
        </p>
      </Section>

      <Section heading="3. Revisions">
        <p>
          Each project includes the number of revision rounds stated in your quote. Additional
          changes beyond that can be quoted separately.
        </p>
      </Section>

      <Section heading="4. Client responsibilities">
        <p>
          You agree to provide content, assets, and feedback in a timely manner, and confirm you
          have the right to use any material you supply (text, images, logos). Delays in providing
          these may affect the timeline.
        </p>
      </Section>

      <Section heading="5. Intellectual property">
        <p>
          Once final payment is received, ownership of the delivered website passes to you.
          Third-party components, fonts, and licensed assets remain under their own licences.
          {' '}
          {site.name} may feature the work in its portfolio unless you ask otherwise.
        </p>
      </Section>

      <Section heading="6. Hosting & maintenance">
        <p>
          Hosting, domains, and ongoing maintenance are optional and, where included, described in
          your quote. Uptime and support levels for third-party hosting are subject to those
          providers.
        </p>
      </Section>

      <Section heading="7. Liability">
        <p>
          Services are provided with reasonable care and skill. To the extent permitted by law,
          {' '}
          {site.name} is not liable for indirect or consequential losses, and total liability is
          limited to the fees paid for the project in question.
        </p>
      </Section>

      <Section heading="8. Contact">
        <p>
          Questions about these terms? Email{' '}
          <a
            href={`mailto:${site.contact.email}`}
            className="font-medium text-brand-600 hover:text-brand-800"
          >
            {site.contact.email}
          </a>
          .
        </p>
      </Section>
    </LegalLayout>
  )
}

export function Privacy() {
  return (
    <LegalLayout title="Privacy Policy">
      <p className="text-sm leading-relaxed">
        This policy explains how {site.name} ({site.domain}) handles the information you share.
        This is starter content, so please adapt it to your business and local laws.
      </p>

      <Section heading="1. What I collect">
        <p>
          When you send an enquiry (via the contact form, WhatsApp, or email), I receive the
          details you choose to share, such as your name, email, phone number, and message. I do not
          collect more than needed to respond to you.
        </p>
      </Section>

      <Section heading="2. How I use it">
        <p>
          Your information is used only to respond to your enquiry, prepare a quote, and deliver any
          project you commission. I do not sell your data or use it for unrelated marketing.
        </p>
      </Section>

      <Section heading="3. Sharing">
        <p>
          I do not share your personal information with third parties except service providers
          needed to run the site or your project (for example, hosting or email providers), and only
          as far as necessary.
        </p>
      </Section>

      <Section heading="4. Cookies & analytics">
        <p>
          This site aims to keep tracking minimal. If privacy-friendly analytics are enabled, they
          are used only to understand which pages and calls-to-action are useful, not to identify
          you personally.
        </p>
      </Section>

      <Section heading="5. Data retention">
        <p>
          Enquiry and project information is kept only as long as needed for our correspondence and
          any legal or accounting requirements, then deleted.
        </p>
      </Section>

      <Section heading="6. Your rights">
        <p>
          You can ask what information I hold about you, request corrections, or ask me to delete it.
          Just get in touch.
        </p>
      </Section>

      <Section heading="7. Contact">
        <p>
          Questions about your privacy? Email{' '}
          <a
            href={`mailto:${site.contact.email}`}
            className="font-medium text-brand-600 hover:text-brand-800"
          >
            {site.contact.email}
          </a>
          .
        </p>
      </Section>
    </LegalLayout>
  )
}

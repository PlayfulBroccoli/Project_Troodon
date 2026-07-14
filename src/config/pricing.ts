/**
 * Single source of truth for pricing, shared by the static /pricing page
 * (plan cards + comparison table) and the interactive /quote wizard.
 *
 * Pricing is still quote-based, not fixed tiers — every number here is an
 * ESTIMATE the client confirms after a chat. Two cost dimensions:
 *   - upfront  : one-off build cost (project base + extra pages + features)
 *   - monthly  : recurring care plan — INCLUDES hosting, maintenance & support
 *
 * Edit these figures to your real rates. Amounts are in CURRENCY.
 */

export const CURRENCY = 'RM'

/** Round to the nearest 50 for a tidier-looking estimate. */
export const round50 = (n: number) => Math.round(n / 50) * 50
export const money = (n: number) => `${CURRENCY} ${n.toLocaleString('en-MY')}`

/** A feature bullet: a bold lead-in phrase plus a short detail. */
export type Point = { lead: string; detail: string }

export type ProjectType = {
  key: string
  label: string
  /** Short one-liner for the pricing card + quote wizard. */
  blurb: string
  /** Longer marketing description for the Home service card. */
  desc: string
  /** One-off base build cost. */
  base: number
  includedPages: number
  /** Feature bullets, shared by the Home service cards and Pricing plan cards. */
  points: Point[]
  featured?: boolean
}

export const projectTypes: ProjectType[] = [
  {
    key: 'landing',
    label: 'Starter Site',
    blurb: 'One focused, high-converting page.',
    desc: 'A single, high-converting page to launch your product or campaign, fast.',
    base: 1200,
    includedPages: 1,
    points: [
      { lead: 'Designed to convert', detail: 'with a clear call-to-action that drives enquiries to your WhatsApp' },
      { lead: 'Mobile-first', detail: 'responsive design that looks sharp on every device' },
      { lead: 'SEO-ready', detail: 'fast-loading foundation so you show up on Google' },
      { lead: 'Contact form', detail: 'and WhatsApp integration built in' },
      { lead: 'Delivered fast', detail: 'and online in days, not weeks' },
    ],
  },
  {
    key: 'business',
    label: 'Business Website',
    blurb: 'A complete multi-page online presence.',
    desc: 'Your complete online presence, everything an established business needs to look legit and win customers.',
    base: 2800,
    includedPages: 5,
    points: [
      { lead: 'Multi-page site', detail: 'with Home, About, Services, Gallery, Contact and more' },
      { lead: 'On-page SEO', detail: 'setup to help customers find you on Google' },
      { lead: 'Showcase your work', detail: 'with photo and service galleries' },
      { lead: 'Fully integrated', detail: 'contact forms, WhatsApp, Google Maps and social links' },
      { lead: 'Easy to update', detail: 'with a clean, editable structure so your content stays fresh' },
    ],
    featured: true,
  },
  {
    key: 'webapp',
    label: 'Custom / Web App',
    blurb: 'A custom tool, dashboard or system.',
    desc: 'Built around your workflow, with custom dashboards, tools, and systems tailored to how your business actually runs.',
    base: 8000,
    includedPages: 3,
    points: [
      { lead: 'Custom dashboards', detail: 'to manage your data, orders, or customers' },
      { lead: 'Bespoke tools', detail: 'and internal systems built to your exact requirements' },
      { lead: 'E-commerce & portals', detail: 'like booking systems or client portals as needed' },
      { lead: 'Secure by design', detail: 'with database-backed logins and role access' },
    ],
  },
]

/** Cost of each page beyond a project type's included pages. */
export const PER_PAGE = 300
export const MIN_PAGES = 1
export const MAX_PAGES = 15

export type Feature = {
  key: string
  label: string
  /** One-off add-on cost. */
  price: number
}

export const features: Feature[] = [
  { key: 'booking', label: 'Booking / scheduling', price: 2500 },
  { key: 'ecommerce', label: 'E-commerce / payments', price: 3000 },
  { key: 'cms', label: 'Editable content (CMS)', price: 1200 },
  { key: 'auth', label: 'User accounts / login', price: 1800 },
  { key: 'seo', label: 'SEO boost', price: 600 },
  { key: 'copywriting', label: 'Copywriting', price: 500 },
  { key: 'branding', label: 'Logo / branding', price: 1200 },
]

export type CarePlan = {
  key: string
  label: string
  /** Recurring monthly fee — INCLUDES managed hosting + free SSL (see HOSTING_NOTE). */
  monthly: number
  blurb: string
  includes: string[]
}

/**
 * Monthly care plans now BUNDLE hosting: the site lives on my managed server
 * and every plan includes a free SSL certificate. A live site must be on a
 * plan — there's no hosting-only tier. The only thing billed separately is a
 * domain, and only if the client doesn't already own one — see DOMAIN_FEE.
 */
export const carePlans: CarePlan[] = [
  {
    key: 'essential',
    label: 'Essential Care',
    monthly: 200,
    blurb: 'Hosting, maintenance & support.',
    includes: [
      'Fast, managed hosting on my own server',
      'Free SSL certificate, always renewed',
      'Automatic backups and security updates',
      'Uptime monitoring so issues get caught early',
      'Up to 5 edits/month',
      'Email support, 2 business-day response',
    ],
  },
  {
    key: 'premium',
    label: 'Premium Care',
    monthly: 250,
    blurb: 'Hosting, maintenance & priority support.',
    includes: [
      'Everything in Essential Care',
      '24/7 priority support with emergency response',
      'Up to 10 edits/month',
      'Admin dashboard for site monitoring',
      'Monthly site reports',
    ],
  },
]

/** One short caveat line: domains are extra, and hosting only covers standard sites. */
export const HOSTING_NOTE =
  "Domains aren't included and are charged separately. Care-plan hosting covers standard marketing sites. Resource-intensive projects, like web apps, large media libraries or high-traffic stores, are quoted separately."

/** Comparison table used on the /pricing page. */
export type ComparisonRow = {
  label: string
  landing: boolean | string
  business: boolean | string
  webapp: boolean | string
}

export const comparisonRows: ComparisonRow[] = [
  { label: 'Pages', landing: '1', business: 'up to ~8', webapp: 'custom' },
  { label: 'Custom design', landing: true, business: true, webapp: true },
  { label: 'Mobile-first', landing: true, business: true, webapp: true },
  { label: 'Contact / enquiry form', landing: true, business: true, webapp: true },
  { label: 'Booking system', landing: false, business: true, webapp: true },
  { label: 'CMS (edit it yourself)', landing: false, business: true, webapp: true },
  { label: 'Database & user accounts', landing: false, business: false, webapp: true },
  { label: 'Support plan', landing: 'optional', business: 'optional', webapp: 'optional' },
  { label: 'Managed hosting', landing: 'with care plan', business: 'with care plan', webapp: 'quoted separately' },
  { label: 'Free SSL', landing: true, business: true, webapp: true },
  { label: 'Typical timeline', landing: 'days', business: '1 to 3 weeks', webapp: 'scoped' },
]

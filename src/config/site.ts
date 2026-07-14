/**
 * Central site configuration — brand, contact, navigation.
 * Keep every hard-coded brand string here so the site stays easy to rebrand.
 */

export const site = {
  name: 'NickBuilds',
  domain: 'nickbuilds.xyz',
  tagline: 'Websites that mean business.',
  description:
    'NickBuilds designs, builds, and hosts fast, modern websites for small businesses, from landing pages to full web apps. Get a quote or book a call.',

  /** Contact — used by the WhatsApp button and enquiry form. */
  contact: {
    // International format, digits only (no +, spaces, or dashes). Update to the real number.
    whatsapp: '60123456789',
    email: 'hello@nickbuilds.xyz',
    // Prefilled message for the WhatsApp deep link.
    whatsappMessage: "Hi NickBuilds! I'd like to talk about a website project.",
  },

  /** Primary nav — pages the next agent will flesh out. */
  nav: [
    { key: 'about', label: 'About', href: '/about' },
    { key: 'services', label: 'Services', href: '/services' },
    { key: 'portfolio', label: 'Portfolio', href: '/portfolio' },
    { key: 'pricing', label: 'Pricing', href: '/pricing' },
    { key: 'quote', label: 'Quote', href: '/quote' },
    { key: 'faq', label: 'FAQ', href: '/faq' },
    { key: 'contact', label: 'Contact', href: '/contact' },
  ],
} as const

/** Build a wa.me deep link with the prefilled enquiry message. */
export function whatsappLink(message: string = site.contact.whatsappMessage): string {
  return `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(message)}`
}

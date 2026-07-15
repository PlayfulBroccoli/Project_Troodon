import { Link } from 'react-router-dom'
import { site, whatsappLink } from '../config/site'
import { WhatsAppIcon } from './icons'

/**
 * Site footer — multi-column on desktop, stacked on mobile.
 * Brand mark, nav links and contact channels all come from config so the
 * footer never drifts from the rest of the site.
 */
export function Footer() {
  const year = new Date().getFullYear()
  const initial = site.name.charAt(0)

  return (
    <footer className="mt-16 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-lg font-black text-white">
                {initial}
              </span>
              <span className="text-lg font-bold text-gray-900">{site.name}</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-gray-500">{site.tagline}</p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Explore</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {site.nav.map((l) => (
                <li key={l.key}>
                  <Link to={l.href} className="text-gray-600 transition hover:text-brand-700">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get in touch */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Get in touch</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="text-gray-600 transition hover:text-brand-700"
                >
                  {site.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-gray-600 transition hover:text-brand-700"
                >
                  <WhatsAppIcon width={15} height={15} />
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-gray-200 pt-6 text-sm text-gray-400 sm:flex-row">
          <span>
            &copy; {year} {site.name}
          </span>
          <div className="flex items-center gap-5">
            <Link to="/terms" className="transition hover:text-gray-600">
              Terms
            </Link>
            <Link to="/privacy" className="transition hover:text-gray-600">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
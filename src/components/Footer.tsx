import { Link } from 'react-router-dom'
import { site } from '../config/site'

/** Minimal glass footer — mirrors the reference site's layout. */
export function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-gray-400 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="grid h-5 w-5 place-items-center rounded bg-brand-600 text-[10px] font-black text-white">
            D
          </span>
          <span>
            &copy; {new Date().getFullYear()} {site.name}
          </span>
        </div>
        <div className="flex items-center gap-5">
          <Link to="/terms" className="transition hover:text-gray-600">
            Terms
          </Link>
          <Link to="/privacy" className="transition hover:text-gray-600">
            Privacy
          </Link>
          <a href={`mailto:${site.contact.email}`} className="transition hover:text-gray-600">
            {site.contact.email}
          </a>
        </div>
      </div>
    </footer>
  )
}

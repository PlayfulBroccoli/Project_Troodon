import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { site } from '../config/site'
import { MenuIcon, CloseIcon } from './icons'

/**
 * Sticky glass header. Matches the reference site: blurred translucent bar,
 * brand mark on the left, nav + Sign-in-style CTA on the right, mobile drawer.
 */
export function Header() {
  const [open, setOpen] = useState(false)

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition hover:text-brand-700 ${
      isActive ? 'text-brand-700' : 'text-gray-600'
    }`

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/85 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        {/* Brand */}
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-lg font-black text-white">
            {site.name.charAt(0)}
          </span>
          <span className="text-lg font-bold text-gray-900">{site.name}</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          {site.nav.map((l) => (
            <NavLink key={l.key} to={l.href} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="-mr-2 p-2 text-gray-700 hover:text-brand-700 md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <CloseIcon width={24} height={24} /> : <MenuIcon width={24} height={24} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-black/5 bg-white/95 backdrop-blur md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col px-4 py-2">
            {site.nav.map((l) => (
              <NavLink
                key={l.key}
                to={l.href}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `border-b border-black/5 py-3 text-base font-medium transition hover:text-brand-700 ${
                    isActive ? 'text-brand-700' : 'text-gray-700'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { clinic } from './data'
import { MenuIcon, CloseIcon } from '../../components/icons'
import './clinic.css'
import './clinic-layout.css'

/**
 * Perspective sidebar — the one navigation rail across every clinic demo view.
 * Grouped by who's looking: what the PATIENT sees vs what the STAFF (clinic)
 * sees. Lets someone touring the demo jump between the two sides of the
 * product instead of hunting for per-page links. Mirrors the restaurant demo's
 * DemoSidebar with the clinic's own calm-clinical tokens.
 */

type Item = {
  to: string
  title: string
  sub: string
  /** matches a path prefix rather than the exact `to` (e.g. /table/:n) */
  prefix?: string
}

const PATIENT: Item[] = [
  { to: '/demos/clinic', title: 'Brand view', sub: 'The clinic site' },
  { to: '/demos/clinic/book', title: 'Book appointment', sub: 'Pick a time' },
]

const STAFF: Item[] = [
  { to: '/demos/clinic/reception', title: 'Reception', sub: 'Front desk · today' },
  { to: '/demos/clinic/roster', title: 'Doctor roster', sub: 'Schedules · days off' },
]

export function ClinicSidebar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  const isActive = (item: Item) =>
    item.prefix ? pathname.startsWith(item.prefix) : pathname === item.to

  // close the mobile drawer after navigating
  const close = () => setOpen(false)

  return (
    <>
      {/* Mobile toggle */}
      <button
        type="button"
        className="cl-side-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        aria-expanded={open}
      >
        {open ? <CloseIcon width={20} height={20} /> : <MenuIcon width={20} height={20} />}
      </button>

      {open && <div className="cl-side-backdrop" onClick={close} aria-hidden="true" />}

      <aside className={`cl-side ${open ? '' : 'cl-side--closed'}`}>
        {/* Brand head */}
        <Link to="/demos/clinic/reception" onClick={close} className="flex items-center gap-2.5 px-5 pt-5 pb-3">
          <span className="cl-monogram h-9 w-9 text-base" style={{ background: 'var(--cl-primary)' }}>
            {clinic.monogram}
          </span>
          <div>
            <div className="cl-display text-lg leading-none text-[var(--cl-ink)]">{clinic.name}</div>
            <div className="cl-mono text-[10px] uppercase tracking-widest text-[var(--cl-primary)]">Live demo</div>
          </div>
        </Link>

        <nav className="flex-1 overflow-y-auto pb-4">
          <Group label="Patient" items={PATIENT} isActive={isActive} onNav={close} />
          <Group label="Staff" items={STAFF} isActive={isActive} onNav={close} />
        </nav>

        {/* Foot — back to the studio */}
        <div className="border-t border-[var(--cl-line)] px-5 py-3">
          <Link to="/portfolio" onClick={close} className="cl-mono text-[11px] uppercase tracking-widest text-[var(--cl-ink-soft)] hover:text-[var(--cl-primary)]">
            ← Back to NickBuilds
          </Link>
        </div>
      </aside>
    </>
  )
}

function Group({
  label,
  items,
  isActive,
  onNav,
}: {
  label: string
  items: Item[]
  isActive: (i: Item) => boolean
  onNav: () => void
}) {
  return (
    <div>
      <div className="cl-side-group">{label}</div>
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onNav}
          className={`cl-side-item ${isActive(item) ? 'cl-side-item--active' : ''}`}
        >
          <span className="cl-side-item-title">{item.title}</span>
          <span className="cl-side-item-sub">{item.sub}</span>
        </NavLink>
      ))}
    </div>
  )
}
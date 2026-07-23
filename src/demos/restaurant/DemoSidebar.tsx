import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { restaurant } from './data'
import { MenuIcon, CloseIcon } from '../../components/icons'
import './restaurant.css'
import './demo-layout.css'

/**
 * Perspective sidebar — the one navigation rail across every restaurant demo
 * view. Grouped by who's looking: what the CUSTOMER sees vs what the STAFF
 * sees. Lets someone touring the demo jump between the two sides of the product
 * instead of hunting for per-page links.
 */

type Item = {
  to: string
  title: string
  sub: string
  /** matches a path prefix rather than the exact `to` (e.g. /table/:n) */
  prefix?: string
}

const CUSTOMER: Item[] = [
  { to: '/demos/restaurant', title: 'Brand view', sub: 'The website' },
  { to: '/demos/restaurant/tables', title: 'Table tents', sub: 'QR codes · scan to order' },
  { to: '/demos/restaurant/table/1', title: 'At a table', sub: 'Customer ordering', prefix: '/demos/restaurant/table' },
]

const STAFF: Item[] = [
  { to: '/demos/restaurant/staff', title: 'Overview', sub: "Who's working" },
  { to: '/demos/restaurant/floor', title: 'Floor', sub: 'Waiter · dining room' },
  { to: '/demos/restaurant/kitchen', title: 'Kitchen', sub: 'The line · cooking' },
]

export function DemoSidebar() {
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
        className="rd-side-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        aria-expanded={open}
      >
        {open ? <CloseIcon width={20} height={20} /> : <MenuIcon width={20} height={20} />}
      </button>

      {open && <div className="rd-side-backdrop" onClick={close} aria-hidden="true" />}

      <aside className={`rd-side ${open ? '' : 'rd-side--closed'}`}>
        {/* Brand head */}
        <Link to="/demos/restaurant/staff" onClick={close} className="flex items-center gap-2.5 px-5 pt-5 pb-3">
          <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-[var(--rd-ink)] rd-display text-base text-[var(--rd-ink)]">
            {restaurant.monogram}
          </span>
          <div>
            <div className="rd-display text-lg leading-none text-[var(--rd-ink)]">{restaurant.name}</div>
            <div className="rd-mono text-[10px] uppercase tracking-widest text-[var(--rd-clay)]">Live demo</div>
          </div>
        </Link>

        <nav className="flex-1 overflow-y-auto pb-4">
          <Group label="Customer" items={CUSTOMER} isActive={isActive} onNav={close} />
          <Group label="Staff" items={STAFF} isActive={isActive} onNav={close} />
        </nav>

        {/* Foot — back to the studio */}
        <div className="border-t border-[var(--rd-rule)] px-5 py-3">
          <Link to="/portfolio" onClick={close} className="rd-mono text-[11px] uppercase tracking-widest text-[var(--rd-ink-soft)] hover:text-[var(--rd-clay)]">
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
      <div className="rd-side-group">{label}</div>
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onNav}
          className={`rd-side-item ${isActive(item) ? 'rd-side-item--active' : ''}`}
        >
          <span className="rd-side-item-title">{item.title}</span>
          <span className="rd-side-item-sub">{item.sub}</span>
        </NavLink>
      ))}
    </div>
  )
}
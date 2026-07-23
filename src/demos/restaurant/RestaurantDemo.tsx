import { useState } from 'react'
import { Link } from 'react-router-dom'
import { whatsappLink } from '../../config/site'
import { WhatsAppIcon } from '../../components/icons'
import { CartProvider } from './useCart'
import { useCart } from './cart'
import { restaurant, type Category } from './data'
import { Menu } from './Menu'
import { Booking } from './Booking'
import { CartDrawer } from './CartDrawer'
import { BagIcon, ClockIcon, PinIcon, ArrowRightIcon, BowlIcon, CalendarIcon } from './icons'
import './restaurant.css'

/**
 * Kuali Kitchen — the brand showcase (the customer's "website" view). Rendered
 * inside DemoLayout, which provides the perspective sidebar and the `.rd`
 * surface. Wrapped in CartProvider so the header count, menu, drawer, and
 * booking share one cart.
 */
export function RestaurantDemo() {
  return (
    <CartProvider>
      <Shell />
    </CartProvider>
  )
}

function Shell() {
  const [tab, setTab] = useState<'menu' | 'book'>('menu')
  const [cat, setCat] = useState<Category>('Mains')
  const [cartOpen, setCartOpen] = useState(false)
  const { count } = useCart()

  return (
    <>
      {/* ---------- Header ---------- */}
      <header className="sticky top-0 z-40 border-b border-[var(--rd-rule)] bg-[var(--rd-paper)]/85 backdrop-blur-md">
        <nav className="mx-auto flex max-w-5xl items-center justify-between pl-20 pr-6 py-3.5 lg:px-6">
          <Link to="/demos/restaurant" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-[var(--rd-ink)] rd-display text-base text-[var(--rd-ink)]">
              {restaurant.monogram}
            </span>
            <span className="rd-display text-xl text-[var(--rd-ink)]">{restaurant.name}</span>
          </Link>

          {/* Tab switch */}
          <div className="hidden items-center gap-1 sm:flex">
            <TabButton on={tab === 'menu'} onClick={() => setTab('menu')} icon={<BowlIcon width={15} height={15} />}>
              Menu
            </TabButton>
            <TabButton
              on={tab === 'book'}
              onClick={() => setTab('book')}
              icon={<CalendarIcon width={15} height={15} />}
            >
              Book a table
            </TabButton>
          </div>

          {/* Cart */}
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="relative inline-flex items-center gap-2 rd-btn rd-btn--solid !px-3 !py-2 text-xs"
            aria-label={`Open cart, ${count} items`}
          >
            <BagIcon width={16} height={16} />
            <span className="hidden sm:inline">Order</span>
            <span className="rd-mono -mr-1 inline-grid min-w-5 place-items-center rounded-full bg-[var(--rd-clay)] px-1.5 text-[11px] text-white">
              {count}
            </span>
          </button>
        </nav>

        {/* Mobile tab switch */}
        <div className="flex gap-1 border-t border-[var(--rd-rule)] px-6 py-2 sm:hidden">
          <TabButton on={tab === 'menu'} onClick={() => setTab('menu')} icon={<BowlIcon width={15} height={15} />}>
            Menu
          </TabButton>
          <TabButton on={tab === 'book'} onClick={() => setTab('book')} icon={<CalendarIcon width={15} height={15} />}>
            Book a table
          </TabButton>
        </div>
      </header>

      {/* ---------- Hero ---------- */}
      <section className="relative mx-auto max-w-5xl px-6 pt-16 pb-12 sm:pt-24">
        {/* Decorative plate + steam, right side on larger screens */}
        <div className="pointer-events-none absolute right-6 top-16 hidden h-56 w-56 lg:block" aria-hidden="true">
          <div className="absolute inset-0 rounded-full border border-[var(--rd-ink)]/15" />
          <div className="absolute inset-6 rounded-full border-2 border-dashed border-[var(--rd-clay)]/40" />
          <div className="absolute inset-0 grid place-items-center">
            <span className="rd-display text-6xl text-[var(--rd-ink)]/15">{restaurant.monogram}</span>
          </div>
          {/* Steam wisps */}
          <span className="rd-steam absolute left-1/3 top-6 h-16 w-3 rounded-full bg-[var(--rd-ink)]/15" style={{ animationDelay: '0s' }} />
          <span className="rd-steam absolute left-1/2 top-6 h-16 w-3 rounded-full bg-[var(--rd-ink)]/15" style={{ animationDelay: '1.4s' }} />
          <span className="rd-steam absolute left-2/3 top-6 h-16 w-3 rounded-full bg-[var(--rd-ink)]/15" style={{ animationDelay: '2.6s' }} />
        </div>

        <div className="max-w-2xl">
          <div className="rd-rise rd-eyebrow mb-5">{restaurant.area}</div>
          <h1 className="rd-rise text-5xl leading-[1.02] text-[var(--rd-ink)] sm:text-7xl" style={{ animationDelay: '80ms' }}>
            {restaurant.name}
          </h1>
          <p className="rd-rise rd-italic mt-4 text-2xl text-[var(--rd-clay)]" style={{ animationDelay: '160ms' }}>
            {restaurant.tagline}
          </p>
          <p className="rd-rise mt-5 max-w-xl text-lg leading-relaxed text-[var(--rd-ink-soft)]" style={{ animationDelay: '240ms' }}>
            {restaurant.blurb}
          </p>

          <div className="rd-rise mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[var(--rd-ink-soft)]" style={{ animationDelay: '320ms' }}>
            <span className="inline-flex items-center gap-2">
              <ClockIcon width={16} height={16} /> {restaurant.hours}
            </span>
            <span className="inline-flex items-center gap-2">
              <PinIcon width={16} height={16} /> {restaurant.area}
            </span>
          </div>

          <div className="rd-rise mt-8 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: '400ms' }}>
            <a href="#menu" onClick={() => setTab('menu')} className="rd-btn rd-btn--clay">
              See the menu <ArrowRightIcon width={16} height={16} />
            </a>
            <button type="button" onClick={() => setTab('book')} className="rd-btn rd-btn--ghost">
              Book a table
            </button>
          </div>
        </div>
      </section>

      {/* ---------- Body ---------- */}
      {tab === 'menu' ? (
        <Menu active={cat} setActive={setCat} />
      ) : (
        <Booking />
      )}

      {/* ---------- Footer ---------- */}
      <footer className="border-t border-[var(--rd-rule)] px-6 py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">
          <span className="rd-display text-2xl text-[var(--rd-ink)]">{restaurant.name}</span>
          <p className="rd-italic text-[var(--rd-ink-soft)]">{restaurant.tagline}</p>
          <a href={whatsappLink(restaurant.whatsappMessage)} target="_blank" rel="noopener noreferrer" className="rd-btn rd-btn--ghost !text-xs">
            <WhatsAppIcon width={15} height={15} /> Message the kitchen
          </a>
          <p className="rd-mono mt-2 text-[11px] text-[var(--rd-ink-soft)]">
            {restaurant.hours} · {restaurant.area}
          </p>
          <p className="rd-mono mt-4 text-[10px] text-[var(--rd-ink-soft)]/70">
            A live demo built by NickBuilds — not a real restaurant.
          </p>
        </div>
      </footer>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}

function TabButton({
  on,
  onClick,
  icon,
  children,
}: {
  on: boolean
  onClick: () => void
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`inline-flex items-center gap-1.5 rd-mono px-3 py-2 text-xs transition ${
        on ? 'text-[var(--rd-ink)]' : 'text-[var(--rd-ink-soft)] hover:text-[var(--rd-ink)]'
      }`}
    >
      {icon}
      {children}
      {on && <span className="ml-1 h-1 w-1 rounded-full bg-[var(--rd-clay)]" />}
    </button>
  )
}
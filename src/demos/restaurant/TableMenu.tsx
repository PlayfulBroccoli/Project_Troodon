import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { restaurant, type Category } from './data'
import { CartProvider } from './useCart'
import { useCart } from './cart'
import { callWaiter } from './store'
import { Menu } from './Menu'
import { CartDrawer } from './CartDrawer'
import { BagIcon, ArrowRightIcon, BellIcon, CheckIcon } from './icons'
import './restaurant.css'

/**
 * Per-table scan-to-order menu — what a guest sees after "scanning" a table
 * tent (in this concept demo, by tapping Open menu on /tables). Same printed
 * menu aesthetic as the brand showcase, but checkout writes the order into the
 * live store so it lands on the kitchen board for that table number.
 */
export function TableMenu() {
  // route param; guard for non-numeric / missing just in case
  const { n } = useParams()
  const table = Math.max(1, Math.min(99, Number(n) || 1))

  return (
    <CartProvider>
      <Shell table={table} />
    </CartProvider>
  )
}

function Shell({ table }: { table: number }) {
  const [cat, setCat] = useState<Category>('Mains')
  const [cartOpen, setCartOpen] = useState(false)
  const [called, setCalled] = useState(false)
  const { count } = useCart()

  const call = () => {
    callWaiter(table, 'Service')
    setCalled(true)
    setTimeout(() => setCalled(false), 4000)
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--rd-rule)] bg-[var(--rd-paper)]/90 backdrop-blur-md">
        <nav className="mx-auto flex max-w-5xl items-center justify-between pl-20 pr-6 py-3.5 lg:px-6">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-[var(--rd-ink)] rd-display text-base text-[var(--rd-ink)]">
              {restaurant.monogram}
            </span>
            <div>
              <div className="rd-display text-lg leading-none text-[var(--rd-ink)]">{restaurant.name}</div>
              <div className="rd-mono text-[10px] uppercase tracking-widest text-[var(--rd-clay)]">
                Table {table} · scan to order
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative inline-flex items-center gap-2 rd-btn rd-btn--solid !px-3 !py-2 text-xs"
              aria-label={`Open order, ${count} items`}
            >
              <BagIcon width={16} height={16} />
              <span className="hidden sm:inline">Order</span>
              <span className="rd-mono -mr-1 inline-grid min-w-5 place-items-center rounded-full bg-[var(--rd-clay)] px-1.5 text-[11px] text-white">
                {count}
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Compact hero specific to the table */}
      <section className="mx-auto max-w-3xl px-6 pt-12 pb-2 text-center">
        <div className="rd-rise rd-eyebrow mb-3">You're at Table {table}</div>
        <h1 className="rd-rise text-4xl text-[var(--rd-ink)] sm:text-5xl" style={{ animationDelay: '70ms' }}>
          Build your order
        </h1>
        <p className="rd-rise rd-italic mt-3 text-lg text-[var(--rd-ink-soft)]" style={{ animationDelay: '140ms' }}>
          Add dishes, then send straight to the kitchen — no queue, no waving anyone down.
        </p>
        <div className="rd-rise mt-6 flex flex-wrap justify-center gap-3" style={{ animationDelay: '210ms' }}>
          <a href="#menu" className="rd-btn rd-btn--clay">
            Browse the menu <ArrowRightIcon width={16} height={16} />
          </a>
          <button type="button" onClick={call} className="rd-btn rd-btn--ghost">
            {called ? (
              <>
                <CheckIcon width={15} height={15} /> Waiter&rsquo;s on the way
              </>
            ) : (
              <>
                <BellIcon width={15} height={15} /> Call your waiter
              </>
            )}
          </button>
        </div>
      </section>

      <Menu active={cat} setActive={setCat} />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} table={table} />
    </>
  )
}
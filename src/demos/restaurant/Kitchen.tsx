import { Link } from 'react-router-dom'
import { restaurant, menu, money } from './data'
import {
  useKitchen,
  advance,
  toggleSoldOut,
  resetDemo,
  type Order,
  type OrderStatus,
} from './store'
import { PlusIcon, ArrowRightIcon } from './icons'
import './restaurant.css'
import './kitchen.css'

/**
 * Kitchen board — the cooking line. A live order kanban (new → preparing →
 * ready; done = collected by floor), plus the menu availability panel (86 a
 * dish and every guest menu updates in real time). The kitchen fires orders
 * "ready"; the floor runs them and marks served — that hand-off lives on the
 * Floor board. Reads the shared store, so orders placed on a table menu (even
 * in another tab) appear here instantly.
 */
const COLUMNS: { key: OrderStatus; label: string; dot: string }[] = [
  { key: 'new', label: 'New', dot: 'rd-dot--new' },
  { key: 'preparing', label: 'Preparing', dot: 'rd-dot--preparing' },
  { key: 'ready', label: 'Ready · fire', dot: 'rd-dot--ready' },
  { key: 'done', label: 'Served', dot: 'rd-dot--done' },
]

function timeAgo(placedAt: number): string {
  const mins = Math.round((Date.now() - placedAt) / 60000)
  if (mins < 1) return 'just now'
  if (mins === 1) return '1 min ago'
  if (mins < 60) return `${mins} min ago`
  return `${Math.floor(mins / 60)}h ${mins % 60}m ago`
}

function waiting(placedAt: number): number {
  return Math.max(0, Math.round((Date.now() - placedAt) / 60000))
}

export function Kitchen() {
  const { orders, soldOut } = useKitchen()
  const newCount = orders.filter((o) => o.status === 'new').length

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--rd-rule)] bg-[var(--rd-paper)]/90 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between pl-20 pr-6 py-3.5 lg:px-6">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-[var(--rd-ink)] rd-display text-base text-[var(--rd-ink)]">
              {restaurant.monogram}
            </span>
            <div>
              <div className="rd-display text-lg leading-none text-[var(--rd-ink)]">{restaurant.name}</div>
              <div className="rd-mono text-[10px] uppercase tracking-widest text-[var(--rd-clay)]">
                Kitchen · the line
              </div>
            </div>
          </div>
          <span className="rd-mono text-xs text-[var(--rd-ink-soft)]">
            {newCount > 0 ? `${newCount} new` : 'All clear'}
          </span>
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-8">
        {/* Live banner */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="rd-dot rd-dot--new" />
            <span className="rd-italic text-[var(--rd-ink-soft)]">
              {newCount > 0
                ? `${newCount} new ticket${newCount > 1 ? 's' : ''} waiting — start cooking.`
                : 'No new tickets. Orders placed on any table appear here instantly.'}
            </span>
          </div>
          <button type="button" onClick={resetDemo} className="rd-mono text-[11px] uppercase tracking-widest text-[var(--rd-ink-soft)] hover:text-[var(--rd-clay)]">
            Reset demo
          </button>
        </div>

        {/* ---------- Kanban ---------- */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {COLUMNS.map((col) => {
            const colOrders = orders.filter((o) => o.status === col.key)
            return (
              <div key={col.key} className="rd-col">
                <div className="rd-col-head">
                  <span className="flex items-center gap-2">
                    <span className={`rd-dot ${col.dot}`} />
                    {col.label}
                  </span>
                  <span className="text-[var(--rd-ink-soft)]">{colOrders.length}</span>
                </div>
                {colOrders.length === 0 ? (
                  <p className="rd-mono mt-2 text-[11px] text-[var(--rd-ink-soft)]/60">No tickets.</p>
                ) : (
                  colOrders.map((o) => <OrderCard key={o.id} order={o} />)
                )}
              </div>
            )
          })}
        </div>

        {/* ---------- Availability — 86 a dish ---------- */}
        <div className="mt-8">
          <h2 className="rd-col-head mb-3">
            <span>Menu availability</span>
            <span className="text-[var(--rd-ink-soft)]">86 a dish · syncs to every menu</span>
          </h2>
          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
            {menu.map((d) => {
              const out = soldOut.includes(d.id)
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => toggleSoldOut(d.id)}
                  className={`rd-86 ${out ? 'rd-86--out' : ''}`}
                >
                  <span className="flex-1 text-left">
                    <span className="rd-display">{d.name}</span>
                    <span className="rd-mono ml-2 text-xs text-[var(--rd-ink-soft)]">{money(d.price)}</span>
                  </span>
                  {out ? (
                    <span className="rd-mono text-[10px] uppercase tracking-widest text-[var(--rd-clay)]">Sold out</span>
                  ) : (
                    <PlusIcon width={14} height={14} />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <p className="rd-mono mt-8 text-center text-[11px] text-[var(--rd-ink-soft)]/70">
          Fire an order Ready and it jumps to the{' '}
          <Link to="/demos/restaurant/floor" className="text-[var(--rd-clay)] hover:underline">
            Floor board <ArrowRightIcon width={12} height={12} className="inline -mt-0.5" />
          </Link>{' '}
          for a waiter to run.
        </p>
      </section>
    </>
  )
}

function OrderCard({ order }: { order: Order }) {
  const wait = waiting(order.placedAt)
  // Kitchen stops at Ready — the floor marks served. Done = already collected.
  const next =
    order.status === 'new' ? 'Start' : order.status === 'preparing' ? 'Fire ready' : null
  const stale = order.status === 'new' && wait >= 5

  return (
    <div className={`rd-order rd-order--${order.status}`}>
      <div className="flex items-center justify-between">
        <span className={`rd-table-tag ${order.table === 0 ? 'rd-table-tag--out' : ''}`}>
          {order.table === 0 ? 'Takeaway' : `Table ${order.table}`}
        </span>
        <span
          className={`rd-mono text-[10px] ${stale ? 'text-[var(--rd-clay)] font-semibold' : 'text-[var(--rd-ink-soft)]'}`}
        >
          {timeAgo(order.placedAt)}
        </span>
      </div>
      <ul className="mt-2 space-y-0.5 text-sm">
        {order.lines.map((l) => (
          <li key={l.name} className="flex justify-between gap-2">
            <span className="text-[var(--rd-ink)]">
              <span className="rd-mono font-semibold text-[var(--rd-clay)]">{l.qty}×</span> {l.name}
            </span>
          </li>
        ))}
      </ul>
      {order.note && <p className="rd-italic mt-1.5 text-xs text-[var(--rd-ink-soft)]">“{order.note}”</p>}
      <div className="mt-2.5 flex items-center justify-between">
        {order.status === 'ready' ? (
          <span className="rd-mono text-[10px] uppercase tracking-widest text-[var(--rd-olive)]">
            Waiting for floor
          </span>
        ) : order.status === 'done' ? (
          <span className="rd-mono text-[10px] uppercase tracking-widest text-[var(--rd-ink-soft)]/60">
            Collected
          </span>
        ) : (
          <span className="rd-mono text-xs text-[var(--rd-ink-soft)]">{money(order.total)}</span>
        )}
        {next && (
          <button type="button" onClick={() => advance(order.id)} className="rd-advance">
            {next}
          </button>
        )}
      </div>
    </div>
  )
}
import { Link } from 'react-router-dom'
import { restaurant } from './data'
import {
  useKitchen,
  markServed,
  seatTable,
  resetTable,
  clearCall,
  type Table,
  type Order,
} from './store'
import { ArrowRightIcon, CheckIcon, PlusIcon } from './icons'
import './restaurant.css'
import './floor.css'

/**
 * Floor board — the waiter/waitress view. The dining room at a glance: which
 * tables are free, seated, cooking, or have food ready to run. The floor seats
 * guests, runs food the kitchen has fired (ready → served), seats reservations,
 * and answers waiter-call alerts from tables. This is the other half of the
 * hand-off: kitchen fires Ready, floor runs it and marks Served.
 */

/** Seeded reservations so the strip isn't empty for public browsing. */
const reservations = [
  { name: 'Tan', time: '19:00', party: 2, note: 'Window seat' },
  { name: 'Lim', time: '19:30', party: 4 },
  { name: 'Goh', time: '20:30', party: 6, note: 'Birthday' },
]

function timeAgo(at: number): string {
  const mins = Math.round((Date.now() - at) / 60000)
  if (mins < 1) return 'just now'
  if (mins === 1) return '1 min ago'
  return `${mins} min ago`
}

export function Floor() {
  const { orders, tables, calls } = useKitchen()

  const readyOrders = orders.filter((o) => o.status === 'ready' && o.table !== 0)
  const freeCount = tables.filter((t) => t.status === 'available').length

  const seatNext = () => {
    const t = tables.find((tb) => tb.status === 'available')
    if (t) seatTable(t.n)
  }

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
                Floor · waiter
              </div>
            </div>
          </div>
          <span className="rd-mono text-xs text-[var(--rd-ink-soft)]">
            {freeCount} of {tables.length} tables free
          </span>
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-8">
        {/* ---------- Alerts: food to run + waiter calls ---------- */}
        {(readyOrders.length > 0 || calls.length > 0) && (
          <div className="mb-7 space-y-2.5">
            {readyOrders.map((o) => (
              <div key={o.id} className="rd-alert">
                <span className="rd-dot rd-dot--ready" />
                <div className="flex-1">
                  <div className="rd-display text-[var(--rd-ink)]">
                    Table {o.table} · food ready to run
                  </div>
                  <div className="rd-mono text-xs text-[var(--rd-ink-soft)]">
                    {o.lines.map((l) => `${l.qty}× ${l.name}`).join(' · ')}
                  </div>
                </div>
                <button type="button" onClick={() => markServed(o.id)} className="rd-act !text-[var(--rd-olive)]">
                  <CheckIcon width={12} height={12} className="inline -mt-0.5" /> Mark served
                </button>
              </div>
            ))}
            {calls.map((c) => (
              <div key={c.table} className="rd-alert rd-alert--call">
                <span className="rd-dot rd-dot--new" />
                <div className="flex-1">
                  <div className="rd-display text-[var(--rd-ink)]">
                    Table {c.table} called · {c.reason}
                  </div>
                  <div className="rd-mono text-xs text-[var(--rd-ink-soft)]">{timeAgo(c.at)}</div>
                </div>
                <button type="button" onClick={() => clearCall(c.table)} className="rd-act !text-[var(--rd-clay)]">
                  On it
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ---------- Floor plan ---------- */}
        <div className="mb-3 flex items-center justify-between">
          <h2 className="rd-col-head !mb-0">
            <span>Floor plan</span>
          </h2>
          <span className="rd-mono text-[11px] text-[var(--rd-ink-soft)]">
            {freeCount} of {tables.length} free
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {tables.map((t) => (
            <TableTile key={t.n} table={t} orders={orders} />
          ))}
        </div>

        {/* ---------- Reservations ---------- */}
        <div className="mt-8">
          <h2 className="rd-col-head mb-3">
            <span>Reservations</span>
            <span className="text-[var(--rd-ink-soft)]">{reservations.length} tonight</span>
          </h2>
          <div className="rd-panel p-2">
            {reservations.map((r) => (
              <div key={r.name + r.time} className="rd-line">
                <span className="rd-mono text-sm font-semibold text-[var(--rd-ink)]">{r.time}</span>
                <div className="flex-1">
                  <div className="rd-display text-[var(--rd-ink)]">{r.name} · {r.party} pax</div>
                  {r.note && <div className="rd-italic text-xs text-[var(--rd-ink-soft)]">{r.note}</div>}
                </div>
                <button type="button" className="rd-act !text-[var(--rd-ink)]" onClick={seatNext}>
                  Seat
                </button>
              </div>
            ))}
          </div>
        </div>

        <p className="rd-mono mt-8 text-center text-[11px] text-[var(--rd-ink-soft)]/70">
          When the kitchen fires an order Ready it shows up top to run.{' '}
          <Link to="/demos/restaurant/kitchen" className="text-[var(--rd-clay)] hover:underline">
            Open kitchen <ArrowRightIcon width={12} height={12} className="inline -mt-0.5" />
          </Link>
        </p>
      </section>
    </>
  )
}

function TableTile({ table, orders }: { table: Table; orders: Order[] }) {
  const ready = orders.filter((o) => o.table === table.n && o.status === 'ready')
  const active = orders.filter((o) => o.table === table.n && (o.status === 'new' || o.status === 'preparing'))

  let state: 'ready' | 'cooking' | 'seated' | 'served' | 'available'
  let label: string
  let tileClass: string
  let stateClass: string

  if (ready.length > 0) {
    state = 'ready'
    label = 'Food ready'
    tileClass = 'rd-tile--ready'
    stateClass = 'rd-tile-state--ready'
  } else if (active.length > 0) {
    state = 'cooking'
    label = 'Cooking'
    tileClass = 'rd-tile--seated'
    stateClass = 'rd-tile-state--cooking'
  } else if (table.status === 'served') {
    state = 'served'
    label = 'Served'
    tileClass = 'rd-tile--served'
    stateClass = 'rd-tile-state--served'
  } else if (table.status === 'seated') {
    state = 'seated'
    label = 'Seated'
    tileClass = 'rd-tile--seated'
    stateClass = 'rd-tile-state--seated'
  } else {
    state = 'available'
    label = 'Available'
    tileClass = ''
    stateClass = 'rd-tile-state--available'
  }

  return (
    <div className={`rd-tile ${tileClass}`}>
      <div className="rd-tile-head">
        <span className="rd-tile-num">{table.n}</span>
        <span className="rd-tile-seats">{table.seats} seats</span>
      </div>
      <div className={`rd-tile-state ${stateClass}`}>{label}</div>
      <div className="mt-2.5">
        {state === 'ready' && (
          <button
            type="button"
            onClick={() => markServed(ready[0].id)}
            className="rd-act !text-[var(--rd-olive)]"
          >
            <CheckIcon width={12} height={12} className="inline -mt-0.5" /> Mark served
          </button>
        )}
        {state === 'cooking' && (
          <Link to="/demos/restaurant/kitchen" className="rd-mono text-[11px] text-[var(--rd-ink-soft)] hover:text-[var(--rd-ink)]">
            On the line →
          </Link>
        )}
        {state === 'seated' && (
          <Link to={`/demos/restaurant/table/${table.n}`} className="rd-act !text-[var(--rd-ink)]">
            Open menu
          </Link>
        )}
        {state === 'served' && (
          <button type="button" onClick={() => resetTable(table.n)} className="rd-act !text-[var(--rd-ink-soft)]">
            Reset table
          </button>
        )}
        {state === 'available' && (
          <button type="button" onClick={() => seatTable(table.n)} className="rd-act !text-[var(--rd-ink)]">
            <PlusIcon width={12} height={12} className="inline -mt-0.5" /> Seat
          </button>
        )}
      </div>
    </div>
  )
}
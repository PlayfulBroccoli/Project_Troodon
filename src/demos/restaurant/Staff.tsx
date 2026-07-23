import { Link } from 'react-router-dom'
import { restaurant } from './data'
import { useKitchen } from './store'
import { ArrowRightIcon } from './icons'
import './restaurant.css'

/**
 * Staff role picker — the entry point for the back-of-house dashboards. Two
 * roles read the same live data but see what matters to them: the Floor (waiter)
 * runs the dining room; the Kitchen (the line) cooks the tickets. Showing this
 * split is itself a portfolio point — role-based UX, not one board for everyone.
 */
export function Staff() {
  const { orders, tables, calls } = useKitchen()
  const ready = orders.filter((o) => o.status === 'ready' && o.table !== 0).length
  const cooking = orders.filter((o) => o.status === 'new' || o.status === 'preparing').length
  const free = tables.filter((t) => t.status === 'available').length

  return (
    <>
      <header className="border-b border-[var(--rd-rule)] bg-[var(--rd-paper)]/85 backdrop-blur-md">
        <nav className="mx-auto flex max-w-4xl items-center justify-between pl-20 pr-6 py-3.5 lg:px-6">
          <Link to="/demos/restaurant" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-[var(--rd-ink)] rd-display text-base text-[var(--rd-ink)]">
              {restaurant.monogram}
            </span>
            <span className="rd-display text-xl text-[var(--rd-ink)]">{restaurant.name}</span>
          </Link>
          <span className="rd-mono text-[10px] uppercase tracking-widest text-[var(--rd-clay)]">Overview</span>
        </nav>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-12 max-w-xl">
          <div className="rd-eyebrow mb-3">Staff sign-in</div>
          <h1 className="rd-display text-4xl text-[var(--rd-ink)] sm:text-5xl">Who's working?</h1>
          <p className="rd-italic mt-3 text-lg text-[var(--rd-ink-soft)]">
            Pick your station. Both boards share one live picture of the restaurant — what changes
            in the kitchen shows up on the floor, and the other way round.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Floor */}
          <Link to="/demos/restaurant/floor" className="rd-panel group block p-7 transition hover:border-[var(--rd-ink)]">
            <div className="flex items-center justify-between">
              <span className="rd-eyebrow">Floor</span>
              <span className="rd-dot rd-dot--ready" />
            </div>
            <h2 className="rd-display mt-3 text-2xl text-[var(--rd-ink)]">Waiter · floor</h2>
            <p className="rd-italic mt-2 text-[var(--rd-ink-soft)]">
              Seat tables, run food the kitchen fires, seat reservations, answer table calls.
            </p>
            <dl className="rd-mono mt-5 space-y-1 text-xs text-[var(--rd-ink-soft)]">
              <Row k="Tables free" v={`${free} / ${tables.length}`} />
              <Row k="Food ready to run" v={String(ready)} />
              <Row k="Table calls" v={String(calls.length)} />
            </dl>
            <span className="rd-mono mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--rd-clay)]">
              Open floor board <ArrowRightIcon width={15} height={15} />
            </span>
          </Link>

          {/* Kitchen */}
          <Link to="/demos/restaurant/kitchen" className="rd-panel group block p-7 transition hover:border-[var(--rd-ink)]">
            <div className="flex items-center justify-between">
              <span className="rd-eyebrow">Kitchen</span>
              <span className="rd-dot rd-dot--new" />
            </div>
            <h2 className="rd-display mt-3 text-2xl text-[var(--rd-ink)]">Kitchen · the line</h2>
            <p className="rd-italic mt-2 text-[var(--rd-ink-soft)]">
              Start tickets, fire orders ready for the floor, and 86 dishes from the menu.
            </p>
            <dl className="rd-mono mt-5 space-y-1 text-xs text-[var(--rd-ink-soft)]">
              <Row k="Tickets cooking" v={String(cooking)} />
              <Row k="Fired & waiting" v={String(ready)} />
              <Row k="Menu items" v="13 on" />
            </dl>
            <span className="rd-mono mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--rd-clay)]">
              Open kitchen board <ArrowRightIcon width={15} height={15} />
            </span>
          </Link>
        </div>

        <p className="rd-mono mt-10 text-center text-[11px] text-[var(--rd-ink-soft)]/70">
          Live across tabs — open a board in one window and a table menu in another.
        </p>
      </section>
    </>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between border-b border-dashed border-[var(--rd-rule)] py-1">
      <dt>{k}</dt>
      <dd className="font-semibold text-[var(--rd-ink)]">{v}</dd>
    </div>
  )
}
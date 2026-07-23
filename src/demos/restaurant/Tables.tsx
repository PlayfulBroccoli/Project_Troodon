import { Link } from 'react-router-dom'
import { restaurant } from './data'
import { QrPlaceholder } from './QrPlaceholder'
import { PinIcon, ArrowRightIcon } from './icons'
import './restaurant.css'

/**
 * Table tents — the "scan to order" concept page. A grid of per-table cards,
 * each with a decorative QR placeholder and a link to that table's live menu.
 * Represents the physical tent cards a restaurant would print and place on
 * each table. Rendered standalone (outside the studio Layout).
 */
const tableCount = 12

export function Tables() {
  return (
    <>
      <header className="border-b border-[var(--rd-rule)] bg-[var(--rd-paper)]/85 backdrop-blur-md">
        <nav className="mx-auto flex max-w-5xl items-center justify-between pl-20 pr-6 py-3.5 lg:px-6">
          <Link to="/demos/restaurant" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-[var(--rd-ink)] rd-display text-base text-[var(--rd-ink)]">
              {restaurant.monogram}
            </span>
            <span className="rd-display text-xl text-[var(--rd-ink)]">{restaurant.name}</span>
          </Link>
          <span className="rd-mono text-[10px] uppercase tracking-widest text-[var(--rd-clay)]">Customer</span>
        </nav>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-10 max-w-2xl">
          <div className="rd-eyebrow mb-3">Scan to order</div>
          <h1 className="rd-display text-4xl text-[var(--rd-ink)] sm:text-5xl">Table tents</h1>
          <p className="rd-italic mt-3 text-lg text-[var(--rd-ink-soft)]">
            Print these tents, one per table. Guests scan the code with their phone, open the menu,
            and order straight to the kitchen — no app, no queue.
          </p>
          <p className="rd-mono mt-4 text-[11px] uppercase tracking-widest text-[var(--rd-ink-soft)]">
            <PinIcon width={13} height={13} className="inline -mt-0.5" /> {restaurant.area} · {tableCount} tables
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: tableCount }, (_, i) => i + 1).map((n) => (
            <div key={n} className="rd-panel flex flex-col items-center p-5 text-center">
              <div className="rd-mono text-[10px] uppercase tracking-widest text-[var(--rd-ink-soft)]">
                Table
              </div>
              <div className="rd-display text-3xl text-[var(--rd-ink)]">{n}</div>
              <div className="my-4 rounded-[3px] border border-[var(--rd-rule)] p-3">
                <QrPlaceholder seed={n * 7} size={120} />
              </div>
              <Link
                to={`/demos/restaurant/table/${n}`}
                className="rd-btn rd-btn--ghost w-full !py-2 text-xs"
              >
                Open menu
                <ArrowRightIcon width={13} height={13} />
              </Link>
            </div>
          ))}
        </div>

        <p className="rd-mono mt-10 text-center text-[11px] text-[var(--rd-ink-soft)]/70">
          Concept demo — the QR shown is illustrative, not scannable.
        </p>
      </section>
    </>
  )
}
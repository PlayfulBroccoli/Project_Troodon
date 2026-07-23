import { useState } from 'react'
import { Link } from 'react-router-dom'
import { whatsappLink } from '../../config/site'
import { restaurant, money } from './data'
import { useCart } from './cart'
import { placeOrder } from './store'
import { PlusIcon, MinusIcon, TrashIcon, CloseIcon, CheckIcon, ArrowRightIcon } from './icons'

/**
 * Cart drawer — styled as a kitchen order slip (perforated tear-strip, dashed
 * separators, mono type).
 *
 * Two checkout modes:
 *  - WhatsApp (default, `table` unset): hands a prefilled order summary to
 *    WhatsApp. Used by the brand showcase / walk-in menu.
 *  - Kitchen (`table` set): writes the order into the live store, so it appears
 *    on the kitchen board instantly (even in another tab). Used by the per-table
 *    scan-to-order menus.
 */
export function CartDrawer({
  open,
  onClose,
  table,
}: {
  open: boolean
  onClose: () => void
  table?: number
}) {
  const { lines, subtotal, count, setQty, remove, clear } = useCart()
  const [placed, setPlaced] = useState(false)

  if (!open) return null

  const kitchenMode = table !== undefined

  const summary = () => {
    const items = lines.map((l) => `  ${l.qty}× ${l.name} — ${money(l.qty * l.price)}`).join('\n')
    const where = kitchenMode ? `Table ${table}` : 'Walk-in'
    return (
      `${restaurant.whatsappMessage}\n\n` +
      `${items}\n\n` +
      `Total: ${money(subtotal)}\n\n` +
      `For: ${where}`
    )
  }

  const place = () => {
    if (kitchenMode) {
      placeOrder({
        table: table!,
        lines: lines.map((l) => ({ name: l.name, qty: l.qty, price: l.price })),
        total: subtotal,
      })
    } else {
      window.open(whatsappLink(summary()), '_blank', 'noopener,noreferrer')
    }
    setPlaced(true)
  }

  const close = () => {
    setPlaced(false)
    onClose()
  }

  return (
    <>
      <div className="rd-overlay" onClick={close} aria-hidden="true" />
      <aside className="rd-drawer" role="dialog" aria-label="Your order">
        {/* Tear-strip header */}
        <div className="rd-ticket-top flex items-start justify-between">
          <div>
            <div className="rd-eyebrow">
              {kitchenMode ? `Table ${table} · order slip` : 'Order slip'}
            </div>
            <h2 className="rd-display mt-1 text-2xl text-[var(--rd-ink)]">Your order</h2>
          </div>
          <button type="button" onClick={close} className="p-1 text-[var(--rd-ink-soft)] hover:text-[var(--rd-ink)]" aria-label="Close cart">
            <CloseIcon width={20} height={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {count === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-[var(--rd-ink-soft)]">
              <span className="rd-display text-5xl text-[var(--rd-ink)]/15">∅</span>
              <p className="rd-italic mt-4">Your slip is empty.</p>
              <p className="rd-mono mt-1 text-xs">Add a dish from the menu.</p>
            </div>
          ) : placed ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-[var(--rd-olive)] text-white">
                <CheckIcon width={24} height={24} />
              </div>
              <h3 className="rd-display mt-4 text-2xl text-[var(--rd-ink)]">To the kitchen!</h3>
              <p className="rd-italic mt-2 text-[var(--rd-ink-soft)]">
                {kitchenMode
                  ? `Your order is on the board for Table ${table}. The kitchen's on it.`
                  : 'Your order is ready in WhatsApp — hit send there to confirm.'}
              </p>
              <div className="mt-6 flex flex-col gap-2">
                {kitchenMode && (
                  <Link to="/demos/restaurant/kitchen" className="rd-btn rd-btn--ghost">
                    See it on the kitchen board
                  </Link>
                )}
                <button type="button" onClick={() => setPlaced(false)} className="rd-btn rd-btn--solid">
                  Edit order
                </button>
                <button
                  type="button"
                  onClick={() => {
                    clear()
                    close()
                  }}
                  className="rd-mono text-[11px] uppercase tracking-widest text-[var(--rd-ink-soft)] hover:text-[var(--rd-clay)]"
                >
                  Start a new order
                </button>
              </div>
            </div>
          ) : (
            <>
              {lines.map((l) => (
                <div key={l.id} className="rd-line">
                  <div className="flex-1">
                    <div className="rd-display text-base text-[var(--rd-ink)]">{l.name}</div>
                    <div className="rd-mono mt-0.5 text-xs text-[var(--rd-ink-soft)]">
                      {money(l.price)} each
                    </div>
                  </div>
                  <div className="rd-qty">
                    <button type="button" onClick={() => setQty(l.id, l.qty - 1)} aria-label={`One less ${l.name}`}>
                      <MinusIcon width={13} height={13} />
                    </button>
                    <span>{l.qty}</span>
                    <button type="button" onClick={() => setQty(l.id, l.qty + 1)} aria-label={`One more ${l.name}`}>
                      <PlusIcon width={13} height={13} />
                    </button>
                  </div>
                  <span className="rd-mono w-16 text-right text-sm font-semibold text-[var(--rd-ink)]">
                    {money(l.qty * l.price)}
                  </span>
                  <button type="button" onClick={() => remove(l.id)} className="text-[var(--rd-ink-soft)] hover:text-[var(--rd-clay)]" aria-label={`Remove ${l.name}`}>
                    <TrashIcon width={16} height={16} />
                  </button>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Footer — total + checkout */}
        {count > 0 && !placed && (
          <div className="border-t-2 border-dashed border-[var(--rd-rule)] px-6 py-5">
            <div className="rd-total-box">
              <span className="rd-eyebrow !text-[var(--rd-ink-soft)]">Total</span>
              <span className="rd-mono text-2xl font-semibold text-[var(--rd-ink)]">{money(subtotal)}</span>
            </div>
            <button type="button" onClick={place} className="rd-btn rd-btn--wa mt-4 w-full">
              {kitchenMode ? 'Send to kitchen' : 'Send order to kitchen'}
              <ArrowRightIcon width={16} height={16} />
            </button>
            <button type="button" onClick={clear} className="rd-mono mt-3 w-full text-center text-[11px] uppercase tracking-widest text-[var(--rd-ink-soft)] hover:text-[var(--rd-clay)]">
              Clear order
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
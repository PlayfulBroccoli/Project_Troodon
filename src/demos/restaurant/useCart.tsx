import { useMemo, useState, type ReactNode } from 'react'
import { menu } from './data'
import { Ctx, type CartCtx, type CartLine } from './cart'

/**
 * Cart provider — the single component export of this module. Holds the cart
 * state (id -> qty) and derives lines/count/subtotal from the menu. In-memory
 * only; resets on navigation, which is fine for a demo (no backend).
 *
 * The context object, types, and `useCart` hook live in cart.ts (no JSX) so this
 * file stays component-only — keeps React Fast Refresh happy.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const [qty, setQty] = useState<Record<string, number>>({})

  const lines = useMemo<CartLine[]>(
    () =>
      Object.entries(qty)
        .map(([id, n]) => {
          const dish = menu.find((d) => d.id === id)
          return dish ? { ...dish, qty: n } : null
        })
        .filter((l): l is CartLine => l !== null),
    [qty],
  )

  const value = useMemo<CartCtx>(() => {
    const count = lines.reduce((s, l) => s + l.qty, 0)
    const subtotal = lines.reduce((s, l) => s + l.qty * l.price, 0)
    return {
      lines,
      count,
      subtotal,
      add: (id) => setQty((q) => ({ ...q, [id]: (q[id] ?? 0) + 1 })),
      setQty: (id, n) =>
        setQty((q) => {
          if (n <= 0) {
            const { [id]: _drop, ...rest } = q
            return rest
          }
          return { ...q, [id]: n }
        }),
      remove: (id) =>
        setQty((q) => {
          const { [id]: _drop, ...rest } = q
          return rest
        }),
      clear: () => setQty({}),
    }
  }, [lines])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
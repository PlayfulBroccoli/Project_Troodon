import { createContext, useContext } from 'react'
import type { Dish } from './data'

/**
 * Cart context + hook — the non-JSX half of the cart module, kept in a `.ts`
 * file so the provider component (in useCart.tsx) can be the only component
 * export there (keeps React Fast Refresh happy).
 */

export type CartLine = Dish & { qty: number }

export type CartCtx = {
  lines: CartLine[]
  count: number
  subtotal: number
  add: (id: string) => void
  setQty: (id: string, qty: number) => void
  remove: (id: string) => void
  clear: () => void
}

export const Ctx = createContext<CartCtx | null>(null)

export function useCart(): CartCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
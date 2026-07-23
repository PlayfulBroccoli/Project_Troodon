import { useSyncExternalStore } from 'react'
import { menu } from './data'

/**
 * Restaurant store — the one piece of "shared state" in the demo. It backs the
 * kitchen board, the floor (waiter) board, and the guest table menus, with no
 * backend: state lives in localStorage (shared across same-origin tabs) and
 * changes are broadcast via BroadcastChannel so any tab updates any other in
 * real time. For a real deploy you'd swap this one module for a tiny API + ws.
 *
 * Two roles read/write the same state:
 *  - Kitchen (the line): starts orders (new→preparing), fires them ready, 86s dishes.
 *  - Floor (waiter): seats tables, runs food the kitchen fired (ready→done/served),
 *    seats reservations, and answers waiter-call alerts from tables.
 * Seeded with realistic mock state so a public visitor sees a living restaurant;
 * real actions during a demo merge in live.
 */

export type OrderStatus = 'new' | 'preparing' | 'ready' | 'done'

export type OrderLine = { name: string; qty: number; price: number }

export type Order = {
  id: string
  table: number // 0 = takeaway / walk-in
  lines: OrderLine[]
  total: number
  placedAt: number // epoch ms
  status: OrderStatus
  note?: string
}

export type TableStatus = 'available' | 'seated' | 'served'

export type Table = { n: number; status: TableStatus; seats: number }

export type WaiterCall = { table: number; reason: string; at: number }

export type KitchenState = {
  orders: Order[]
  /** dish ids marked sold-out ("86") — guest menus can't add these. */
  soldOut: string[]
  tables: Table[]
  /** active waiter-call alerts from tables. */
  calls: WaiterCall[]
}

const KEY = 'kuali-kitchen-v2'
const CHANNEL = 'kuali-kitchen'

let channel: BroadcastChannel | null = null
try {
  channel = new BroadcastChannel(CHANNEL)
} catch {
  channel = null // BroadcastChannel is unavailable (older browser / SSR) — boards still work locally.
}

let cache: KitchenState | null = null
const listeners = new Set<() => void>()

/* ---------------- seed ---------------- */

// (Math.random is fine here — app code, not a workflow script.)

function seed(): KitchenState {
  const now = Date.now()
  const byId = (id: string) => menu.find((d) => d.id === id)!
  const line = (id: string, qty: number): OrderLine => {
    const d = byId(id)
    return { name: d.name, qty, price: d.price }
  }
  const total = (ls: OrderLine[]) => ls.reduce((s, l) => s + l.qty * l.price, 0)

  const orders: Order[] = [
    {
      id: 'k-1042',
      table: 4,
      lines: [line('nasi-lemak', 1), line('teh-tarik', 2)],
      total: total([line('nasi-lemak', 1), line('teh-tarik', 2)]),
      placedAt: now - 1000 * 60 * 1,
      status: 'new',
      note: 'Extra sambal please',
    },
    {
      id: 'k-1041',
      table: 12,
      lines: [line('char-kway-teow', 2), line('spiced-fries', 1)],
      total: total([line('char-kway-teow', 2), line('spiced-fries', 1)]),
      placedAt: now - 1000 * 60 * 4,
      status: 'preparing',
    },
    {
      id: 'k-1040',
      table: 7,
      lines: [line('rendang', 1), line('pak-choi', 1), line('pandan-cooler', 1)],
      total: total([line('rendang', 1), line('pak-choi', 1), line('pandan-cooler', 1)]),
      placedAt: now - 1000 * 60 * 9,
      status: 'preparing',
    },
    {
      id: 'k-1039',
      table: 2,
      lines: [line('satay', 2), line('lime-barley', 1)],
      total: total([line('satay', 2), line('lime-barley', 1)]),
      placedAt: now - 1000 * 60 * 12,
      status: 'ready',
    },
    {
      id: 'k-1038',
      table: 0,
      lines: [line('laksa', 1), line('cendol', 1)],
      total: total([line('laksa', 1), line('cendol', 1)]),
      placedAt: now - 1000 * 60 * 16,
      status: 'ready',
      note: 'Takeaway',
    },
    {
      id: 'k-1037',
      table: 9,
      lines: [line('roti', 2), line('kuih', 1)],
      total: total([line('roti', 2), line('kuih', 1)]),
      placedAt: now - 1000 * 60 * 22,
      status: 'done',
    },
  ]

  const seatsByTable: Record<number, number> = { 2: 2, 4: 2, 7: 4, 9: 6, 12: 4 }
  const tables: Table[] = Array.from({ length: 12 }, (_, i) => {
    const n = i + 1
    const seated = [4, 7, 12, 2].includes(n) // have active/new/preparing/ready orders
    const served = n === 9 // order done
    return {
      n,
      status: served ? 'served' : seated ? 'seated' : 'available',
      seats: seatsByTable[n] ?? 4,
    }
  })

  const calls: WaiterCall[] = [{ table: 7, reason: 'Water', at: now - 1000 * 60 * 2 }]

  return { orders, soldOut: [], tables, calls }
}

/* ---------------- low-level ---------------- */

function read(): KitchenState {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as KitchenState
      if (parsed && Array.isArray(parsed.orders) && Array.isArray(parsed.tables)) return parsed
    }
  } catch {
    /* fall through to seed */
  }
  const s = seed()
  try {
    localStorage.setItem(KEY, JSON.stringify(s))
  } catch {
    /* ignore quota / privacy mode */
  }
  return s
}

function getSnapshot(): KitchenState {
  if (cache === null) cache = read()
  return cache
}

function commit(next: KitchenState) {
  cache = next
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l())
  channel?.postMessage('changed')
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb)
  const onMsg = () => {
    cache = read() // re-read the shared storage another tab wrote
    cb()
  }
  channel?.addEventListener('message', onMsg)
  window.addEventListener('storage', onMsg)
  return () => {
    listeners.delete(cb)
    channel?.removeEventListener('message', onMsg)
    window.removeEventListener('storage', onMsg)
  }
}

/* ---------------- public API: read ---------------- */

export function useKitchen(): KitchenState {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

/* ---------------- public API: orders ---------------- */

export function placeOrder(order: Omit<Order, 'id' | 'placedAt' | 'status'>): Order {
  const state = getSnapshot()
  const full: Order = {
    ...order,
    id: `k-${Math.floor(Math.random() * 9000) + 1100}`,
    placedAt: Date.now(),
    status: 'new',
  }
  // A table that orders is, by definition, seated.
  const tables = state.tables.map((t) =>
    t.n === order.table && t.status === 'available' ? { ...t, status: 'seated' as TableStatus } : t,
  )
  commit({ ...state, orders: [full, ...state.orders], tables })
  return full
}

/** Kitchen: advance new → preparing → ready (stops at ready; the floor marks served). */
export function advance(id: string) {
  const state = getSnapshot()
  const order = state.orders.find((o) => o.id === id)
  if (!order) return
  const next: OrderStatus = order.status === 'new' ? 'preparing' : order.status === 'preparing' ? 'ready' : order.status
  setStatus(id, next)
}

/** Floor: mark a fired (ready) order served → done, and flag the table served. */
export function markServed(id: string) {
  const state = getSnapshot()
  const order = state.orders.find((o) => o.id === id)
  if (!order) return
  const orders = state.orders.map((o) => (o.id === id ? { ...o, status: 'done' as OrderStatus } : o))
  const tables = state.tables.map((t) =>
    t.n === order.table && t.n !== 0 ? { ...t, status: 'served' as TableStatus } : t,
  )
  commit({ ...state, orders, tables })
}

export function setStatus(id: string, status: OrderStatus) {
  const state = getSnapshot()
  commit({
    ...state,
    orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
  })
}

/* ---------------- public API: menu availability ---------------- */

export function toggleSoldOut(dishId: string) {
  const state = getSnapshot()
  const has = state.soldOut.includes(dishId)
  commit({
    ...state,
    soldOut: has ? state.soldOut.filter((d) => d !== dishId) : [...state.soldOut, dishId],
  })
}

export function isSoldOut(soldOut: string[], dishId: string): boolean {
  return soldOut.includes(dishId)
}

/* ---------------- public API: tables (floor) ---------------- */

export function seatTable(n: number) {
  setTableStatus(n, 'seated')
}

export function resetTable(n: number) {
  setTableStatus(n, 'available')
}

export function setTableStatus(n: number, status: TableStatus) {
  const state = getSnapshot()
  commit({
    ...state,
    tables: state.tables.map((t) => (t.n === n ? { ...t, status } : t)),
  })
}

/* ---------------- public API: waiter calls ---------------- */

export function callWaiter(table: number, reason = 'Service') {
  const state = getSnapshot()
  // one active call per table
  if (state.calls.some((c) => c.table === table)) return
  commit({ ...state, calls: [...state.calls, { table, reason, at: Date.now() }] })
}

export function clearCall(table: number) {
  const state = getSnapshot()
  commit({ ...state, calls: state.calls.filter((c) => c.table !== table) })
}

/* ---------------- demo ---------------- */

export function resetDemo() {
  commit(seed())
}
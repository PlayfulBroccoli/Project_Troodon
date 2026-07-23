import { Reveal } from '../../components/Reveal'
import { categories, menu, money, type Category } from './data'
import { useCart } from './cart'
import { useKitchen } from './store'
import { PlusIcon, CheckIcon } from './icons'

/**
 * Menu section — laid out like a printed menu card. Category chips filter the
 * list; each row is a numbered dish with a dotted leader to a mono price.
 * Reads the live sold-out list from the kitchen store, so a dish the kitchen
 * 86's disappears from this menu in real time (even in another tab).
 */
export function Menu({ active, setActive }: { active: Category; setActive: (c: Category) => void }) {
  const { add, lines } = useCart()
  const { soldOut } = useKitchen()
  const shown = menu.filter((d) => d.category === active)

  return (
    <section id="menu" className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <Reveal>
        <div className="mb-8 text-center">
          <div className="rd-eyebrow mb-3">À la carte</div>
          <h2 className="rd-display text-3xl text-[var(--rd-ink)] sm:text-4xl">The menu</h2>
          <p className="rd-italic mt-2 text-[var(--rd-ink-soft)]">
            Cooked to order. Prices in ringgit, tax in.
          </p>
        </div>
      </Reveal>

      {/* Category filter */}
      <Reveal>
        <div className="mb-9 flex flex-wrap justify-center gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActive(c)}
              aria-pressed={c === active}
              className={`rd-chip ${c === active ? 'rd-chip--on' : ''}`}
            >
              {c}
            </button>
          ))}
        </div>
      </Reveal>

      {/* Rows */}
      <div className="rd-panel px-6 py-2 sm:px-9">
        {shown.map((d, i) => {
          const inCart = lines.find((l) => l.id === d.id)
          const out = soldOut.includes(d.id)
          return (
            <div key={d.id} className={`rd-menu-row ${out ? 'opacity-50' : ''}`}>
              <span className="rd-menu-num">{String(i + 1).padStart(2, '0')}</span>
              {/* Name + desc + chips sit in a single block; the leader flexes between. */}
              <div>
                <div className="flex items-center gap-2">
                  <span className={`rd-display text-lg text-[var(--rd-ink)] ${out ? 'line-through' : ''}`}>{d.name}</span>
                  {d.veg && <span className="rd-veg-dot" title="Vegetarian" />}
                  {d.popular && (
                    <span className="rd-stamp">
                      <CheckIcon width={10} height={10} /> Chef&rsquo;s pick
                    </span>
                  )}
                </div>
                <p className="rd-italic mt-0.5 text-sm text-[var(--rd-ink-soft)]">{d.desc}</p>
                <div className="mt-2.5 flex items-center gap-3">
                  {out ? (
                    <span className="rd-mono text-[11px] uppercase tracking-widest text-[var(--rd-clay)]">
                      Sold out
                    </span>
                  ) : (
                    <button type="button" onClick={() => add(d.id)} className="rd-add">
                      <PlusIcon width={13} height={13} />
                      {inCart ? `Added · ${inCart.qty}` : 'Add'}
                    </button>
                  )}
                </div>
              </div>
              {/* price column — own grid cell so it stays right-aligned & unbroken */}
              <span className="rd-menu-price">{money(d.price)}</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
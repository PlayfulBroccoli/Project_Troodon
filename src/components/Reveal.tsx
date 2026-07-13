import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Scroll reveal — Apple-style entrance: fade + rise + a subtle scale-up
 * as the element enters the viewport, once. No animation library; uses
 * IntersectionObserver. Reveals once then disconnects (no flicker on
 * scroll-back), and shows immediately for anyone with reduced motion.
 *
 * The motion itself lives in `.reveal` in index.css — keep it consistent.
 *
 * @param delay  ms to stagger this element behind its neighbours
 * @param as     wrapper element (defaults to div; use a semantic tag if needed)
 */
export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || !('IntersectionObserver' in window)) {
      setVisible(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true)
            io.disconnect()
            break
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : undefined }}
    >
      {children}
    </div>
  )
}
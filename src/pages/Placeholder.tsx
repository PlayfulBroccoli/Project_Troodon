import { Link } from 'react-router-dom'

/**
 * Stub for routes the next agent will build out (Services, Portfolio,
 * Pricing/Quote calculator, FAQ, Contact form + booking). Keeps the nav
 * working and signals intent without pretending to be finished.
 */
export function Placeholder({ title, note }: { title: string; note: string }) {
  return (
    <section className="mx-auto max-w-2xl px-6 py-24 text-center">
      <span className="badge mb-5 inline-block">Coming soon</span>
      <h1 className="mb-3 text-3xl font-bold text-gray-900 sm:text-4xl">{title}</h1>
      <p className="mx-auto mb-8 max-w-md text-gray-500">{note}</p>
      <Link to="/" className="btn-secondary">
        Back to home
      </Link>
    </section>
  )
}

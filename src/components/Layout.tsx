import type { ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { GridBackground } from './GridBackground'
import { WhatsAppFab } from './WhatsAppFab'

/**
 * Page shell: gradient background + grid overlay, sticky header, content,
 * footer, and a floating WhatsApp button. Wrap every page in this.
 */
export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-brand-50">
      <GridBackground />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
      <WhatsAppFab />
    </div>
  )
}

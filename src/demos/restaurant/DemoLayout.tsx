import { Outlet } from 'react-router-dom'
import { DemoSidebar } from './DemoSidebar'
import './restaurant.css'
import './demo-layout.css'

/**
 * Layout for the restaurant demo — renders the shared perspective sidebar and
 * the active view via <Outlet/>. Owns the `.rd` surface (palette, paper grain,
 * fonts) once, so each page is just its own header + sections. The demo routes
 * are nested under this layout in App.tsx.
 */
export function DemoLayout() {
  return (
    <div className="rd rd-app">
      <DemoSidebar />
      <main className="rd-main">
        <Outlet />
      </main>
    </div>
  )
}
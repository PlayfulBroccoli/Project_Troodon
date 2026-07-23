import { Outlet } from 'react-router-dom'
import { ClinicSidebar } from './ClinicSidebar'
import './clinic.css'
import './clinic-layout.css'

/**
 * Layout for the clinic demo — renders the shared perspective sidebar and the
 * active view via <Outlet/>. Owns the `.cl` surface (palette, chart-paper grid,
 * fonts) once, so each page is just its own header + sections. The demo routes
 * are nested under this layout in App.tsx.
 */
export function ClinicLayout() {
  return (
    <div className="cl cl-app">
      <ClinicSidebar />
      <main className="cl-main">
        <Outlet />
      </main>
    </div>
  )
}
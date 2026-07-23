import { Routes, Route, Outlet } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { About } from './pages/About'
import { Portfolio } from './pages/Portfolio'
import { FAQ } from './pages/FAQ'
import { Pricing } from './pages/Pricing'
import { Quote } from './pages/Quote'
import { Contact } from './pages/Contact'
import { Terms, Privacy } from './pages/Legal'
import { Placeholder } from './pages/Placeholder'
import { RestaurantDemo } from './demos/restaurant/RestaurantDemo'
import { DemoLayout } from './demos/restaurant/DemoLayout'
import { Kitchen } from './demos/restaurant/Kitchen'
import { Floor } from './demos/restaurant/Floor'
import { Staff } from './demos/restaurant/Staff'
import { Tables } from './demos/restaurant/Tables'
import { TableMenu } from './demos/restaurant/TableMenu'
import { ClinicLayout } from './demos/clinic/ClinicLayout'
import { ClinicDemo } from './demos/clinic/ClinicDemo'
import { Booking } from './demos/clinic/Booking'
import { Reception } from './demos/clinic/Reception'
import { Roster } from './demos/clinic/Roster'

/**
 * Route table. Marketing + legal pages share the studio shell via a layout
 * route (Layout renders <Outlet/>). The /demos/* demos render standalone —
 * they have their own chrome and identity and are NOT wrapped in the studio
 * header/footer/WhatsApp FAB.
 */
function App() {
  return (
    <Routes>
      <Route
        element={
          <Layout>
            <Outlet />
          </Layout>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/quote" element={<Quote />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
      </Route>

      {/* Standalone portfolio demos — own shell, no studio Layout.
          All restaurant views share DemoLayout (the perspective sidebar). */}
      <Route path="/demos/restaurant" element={<DemoLayout />}>
        <Route index element={<RestaurantDemo />} />
        <Route path="staff" element={<Staff />} />
        <Route path="floor" element={<Floor />} />
        <Route path="kitchen" element={<Kitchen />} />
        <Route path="tables" element={<Tables />} />
        <Route path="table/:n" element={<TableMenu />} />
      </Route>

      {/* Clinic demo — appointment booking, two-sided like the restaurant. */}
      <Route path="/demos/clinic" element={<ClinicLayout />}>
        <Route index element={<ClinicDemo />} />
        <Route path="book" element={<Booking />} />
        <Route path="reception" element={<Reception />} />
        <Route path="roster" element={<Roster />} />
      </Route>

      <Route
        path="*"
        element={
          <Layout>
            <Placeholder title="Page not found" note="This page doesn't exist yet." />
          </Layout>
        }
      />
    </Routes>
  )
}

export default App
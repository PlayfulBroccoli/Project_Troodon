import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { About } from './pages/About'
import { Services } from './pages/Services'
import { Portfolio } from './pages/Portfolio'
import { FAQ } from './pages/FAQ'
import { Pricing } from './pages/Pricing'
import { Quote } from './pages/Quote'
import { Contact } from './pages/Contact'
import { Terms, Privacy } from './pages/Legal'
import { Placeholder } from './pages/Placeholder'

/**
 * Route table. Home is the reference page; all primary routes are now built.
 * The Contact enquiry form still needs a real backend (see docs/ROADMAP.md);
 * Placeholder now only serves the 404 catch-all.
 */
function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/quote" element={<Quote />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route
          path="*"
          element={<Placeholder title="Page not found" note="This page doesn't exist yet." />}
        />
      </Routes>
    </Layout>
  )
}

export default App

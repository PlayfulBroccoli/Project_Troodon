import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Placeholder } from './pages/Placeholder'

/**
 * Route table. Home is the one built-out reference page; the rest are
 * placeholders for the next agent to implement (see docs/ROADMAP.md).
 */
function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/services"
          element={<Placeholder title="Services" note="Detailed service breakdown and what's included in each." />}
        />
        <Route
          path="/portfolio"
          element={<Placeholder title="Portfolio" note="Gallery of past work and case studies." />}
        />
        <Route
          path="/pricing"
          element={<Placeholder title="Pricing & Quote Calculator" note="Interactive quote calculator with 'Get a Quote' actions." />}
        />
        <Route
          path="/faq"
          element={<Placeholder title="FAQ" note="Answers to common questions about scope, timelines, and hosting." />}
        />
        <Route
          path="/contact"
          element={<Placeholder title="Contact & Booking" note="Enquiry form + WhatsApp, plus a booking system to schedule a call." />}
        />
        <Route
          path="*"
          element={<Placeholder title="Page not found" note="This page doesn't exist yet." />}
        />
      </Routes>
    </Layout>
  )
}

export default App

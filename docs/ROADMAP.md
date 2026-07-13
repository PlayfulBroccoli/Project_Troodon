# NickBuilds — Roadmap

Follow [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md) for all UI. Wire brand/contact data
through `src/config/site.ts`.

## Built (2026-07-13)

All primary routes are now implemented, in the solo "I" voice (one person, not a team):

- **Home** — reference page + Testimonials strip (placeholder quotes).
- **About** (`/about`) — bio scaffold; edit the `me` block in `src/pages/About.tsx`
  with real details.
- **Services** (`/services`) — detailed sections + per-service CTA.
- **Portfolio** (`/portfolio`) — card-glass gallery (placeholder projects).
- **Pricing** (`/pricing`) — interactive quote calculator + comparison table.
- **FAQ** (`/faq`) — accordion.
- **Contact** (`/contact`) — enquiry form (WhatsApp/email, **no backend by design**) +
  custom booking widget backed by the booking API.
- **Legal** (`/terms`, `/privacy`) — starter content; review before relying on it.
- **Booking API** (`server/`) — Express + `node:sqlite`, availability + `POST /api/book`.
  Email is a stub (logs); set real hours in `server/src/availability.ts`.

## Remaining content / follow-ups

- Replace placeholder **About bio**, **Portfolio projects**, and **Testimonials**.
- **Booking email** — implement `server/src/email.ts` with a real provider (Resend/nodemailer).
- Replace placeholder **WhatsApp number and email** in `src/config/site.ts`.
- **SPA host rewrite** + reverse-proxy `/api` (see README deploy notes).
- **Analytics** (privacy-friendly) and **SEO/OG tags** per route.

## Original page briefs (for reference)

### 1. Pricing + Quote calculator (`/pricing`)
The centerpiece. Pricing is **not fixed** — lead with **"Get a Quote"**, not fixed tiers.
- An **interactive quote calculator**: user picks project type, number of pages,
  features (booking, e-commerce, CMS, hosting, etc.), and sees an *estimated* range.
- Make clear it's an estimate; every path ends in a "Get a Quote" / "Book a call" CTA.
- Reuse the reference pricing layout for structure (cards + a compare table) but frame
  around packages/estimates rather than fixed monthly prices.

### 2. Contact & Booking (`/contact`)
Two enquiry channels, both prominent:
- **Enquiry form** — name, email/phone, project type, budget, message. Needs a backend
  endpoint or a form service (e.g. a small Node/Express handler on the VPS, or a
  third-party form API). Add spam protection (honeypot + rate limit).
- **WhatsApp** — already wired via `whatsappLink()` in `site.ts`.
- **Booking system** — let clients book a call slot. Options: embed a scheduler, or
  build a lightweight availability + booking flow backed by a small API + DB.

### 3. Portfolio / past work (`/portfolio`)
Gallery of past projects — screenshot/thumbnail, title, short blurb, tags, live link.
Grid of `.card-glass` items; consider a lightbox or per-project detail route.

### 4. Services (`/services`)
Expand the three service shapes from Home into detailed sections: what's included,
typical timeline, and a "Get a Quote" CTA per service.

### 5. FAQ (`/faq`)
Accordion of common questions (scope, timelines, revisions, hosting, payment).
Match the reference FAQ style.

### 6. Testimonials
Client testimonials — either a dedicated section on Home / Portfolio or its own strip.
Card with quote, name, company, optional avatar.

### 7. Legal (`/terms`, `/privacy`)
Currently linked in the footer but unbuilt. Add simple content pages.

## Technical follow-ups

- **Backend for the form + booking.** This is currently a static SPA. Decide: small
  Node/Express API on the same VPS, or serverless/third-party. Store leads + bookings.
- **SPA host rewrite** so deep links work (see README deploy notes).
- **Analytics** (privacy-friendly) to see which CTAs convert.
- **SEO/OG tags** per route (currently only global tags in `index.html`).
- Replace the placeholder **WhatsApp number and email** in `src/config/site.ts` with real ones.

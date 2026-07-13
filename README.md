# DinoSupply

Marketing + enquiry website for **DinoSupply** (dinosupply.xyz) — a one-person
freelance web developer who designs, builds, and hosts websites for small businesses.

Built with **Vite + React 19 + TypeScript + Tailwind CSS v4**.

> **Status:** all primary routes are built (Home, About, Services, Portfolio,
> Pricing quote calculator, FAQ, Contact, Terms, Privacy). The enquiry form is
> WhatsApp/email-based (no backend by design); the **booking flow** is backed by a
> small booking API in [`server/`](server). See [`docs/ROADMAP.md`](docs/ROADMAP.md)
> for remaining follow-ups and [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) for the
> theme you must follow.

## Quick start

```bash
npm install
npm run dev      # frontend only, http://localhost:5173
npm run dev:api  # booking API only, http://localhost:8787
npm run dev:all  # both together (frontend + booking API)
npm run build    # production build → dist/
npm run preview  # serve the production build
```

The booking widget calls `/api/*`; in dev, Vite proxies that to the booking API
(`npm run dev:api`). If the API isn't running, the widget falls back to WhatsApp.

## Booking API (`server/`)

Small Express + `node:sqlite` service (no native deps). Bookings are stored in
`server/bookings.db` (gitignored). Confirmation email is a **stub** (`server/src/email.ts`)
that logs to the console — swap in Resend/nodemailer to send real mail. Set your
real hours in `server/src/availability.ts`.

```bash
npm run dev:api        # watch mode
npm run api            # run once (production)
npm run typecheck:api  # typecheck the server
```

## Project structure

```
src/
  config/site.ts        # ← brand name, WhatsApp number, email, nav links (single source of truth)
  components/
    Layout.tsx          # page shell: background + header + footer + WhatsApp FAB
    Header.tsx          # sticky glass nav + mobile drawer
    Footer.tsx
    GridBackground.tsx  # faint fixed grid overlay
    WhatsAppFab.tsx     # floating WhatsApp button
    icons.tsx           # inline SVG icons (no icon library)
  pages/
    Home.tsx            # ← THE reference page — copy its patterns
    Placeholder.tsx     # stub for unbuilt routes
  index.css             # ← design tokens (@theme) + component classes
  App.tsx               # route table
docs/
  DESIGN_SYSTEM.md      # colors, type, components — read before adding UI
  ROADMAP.md            # features still to build
```

## Conventions

- **Never hard-code brand hex.** Use the `brand-*` Tailwind classes (e.g. `bg-brand-600`).
- **Never hard-code the brand name, WhatsApp number, or email** in a component — import from `src/config/site.ts`.
- Reuse the component classes (`.card-glass`, `.btn-primary`, `.btn-secondary`, `.btn-whatsapp`, `.badge`) defined in `index.css`.
- Contact happens through **two channels**: the WhatsApp deep link and (to be built) an enquiry form.

## Deploy notes

The frontend is a client-side SPA using `react-router-dom` (`BrowserRouter`). When
hosting on a VPS behind nginx/Apache, add a fallback rewrite so deep links resolve to
`index.html` (e.g. nginx `try_files $uri /index.html;`).

Because of the booking flow, the site is **no longer purely static** — run the booking
API as a long-lived process (pm2/systemd) and reverse-proxy `/api` to it, e.g.:

```nginx
location /api/ { proxy_pass http://127.0.0.1:8787; }
location /     { try_files $uri /index.html; }
```

Set `OWNER_EMAIL` (and later real email credentials) in the API's environment.

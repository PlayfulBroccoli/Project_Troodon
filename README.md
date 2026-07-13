# DinoSupply

Marketing + enquiry website for **DinoSupply** (dinosupply.xyz) — a freelance web
studio that designs, builds, and hosts websites for small businesses.

Built with **Vite + React 19 + TypeScript + Tailwind CSS v4**.

> **Status:** base layer only. The **Home** page is fully built as the visual
> reference. Every other route is a placeholder. See [`docs/ROADMAP.md`](docs/ROADMAP.md)
> for what to build next and [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) for the
> theme you must follow.

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # serve the production build
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

This is a client-side SPA using `react-router-dom` (`BrowserRouter`). When hosting on
a VPS behind nginx/Apache, add a fallback rewrite so deep links resolve to
`index.html` (e.g. nginx `try_files $uri /index.html;`).

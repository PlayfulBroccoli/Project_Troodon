# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Read this first, then [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) and
[`docs/ROADMAP.md`](docs/ROADMAP.md).

## What this is

Marketing + enquiry site for **NickBuilds** (nickbuilds.xyz), a freelance web studio.
Vite + React 19 + TypeScript + Tailwind v4. Client-side SPA (`react-router-dom`),
no backend by design.

The **base layer is done**: theme, layout, header/footer, WhatsApp FAB, routing, and
a fully built **Home** page as the visual reference. **All primary routes are now
implemented** (About, Portfolio, Pricing, Quote, FAQ, Contact, Terms, Privacy) in a
solo "I" voice. `src/pages/Placeholder.tsx` now only serves the 404 catch-all. See the
roadmap for remaining content follow-ups (real bio/projects/testimonials, real
WhatsApp number, SPA host rewrite, analytics, per-route SEO).

## Non-negotiable conventions

1. **Follow the design system.** The look mirrors a reference SaaS site but with a
   **turquoise** accent. Use the `.card-glass`, `.btn-primary`, `.btn-secondary`,
   `.btn-whatsapp`, `.badge` classes from `src/index.css` and copy patterns from
   `src/pages/Home.tsx`. Don't invent new visual styles.
2. **No raw brand hex.** Use `brand-*` Tailwind classes. The palette lives in the
   `@theme` block of `src/index.css`.
3. **No hard-coded brand strings.** Brand name, WhatsApp number, email, and nav all
   come from `src/config/site.ts`. Update that file, not components. WhatsApp links
   go through `whatsappLink()` (also in `site.ts`).
4. **Two contact channels.** WhatsApp (`whatsappLink()` — wired into the FAB and
   Contact page) and an enquiry form (built in `src/pages/Contact.tsx`, **no backend
   by design** — it hands off to WhatsApp/email). Keep both prominent.
5. **Pricing is quote-based**, not fixed tiers. Lead with "Get a Quote" → the
   `/quote` calculator; `/pricing` holds an interactive quote calculator + comparison.

## Commands

```bash
npm run dev      # dev server, http://localhost:5173
npm run build    # tsc -b + vite build; run before considering a change done
npm run lint     # oxlint (no ESLint config — oxlint is the only linter)
npm run preview  # serve the production build
```

There is no test runner configured.

## Where things live

- Design tokens + component classes → `src/index.css`
- Brand/contact/nav config + `whatsappLink()` → `src/config/site.ts`
- Shared shell → `src/components/Layout.tsx` (+ Header/Footer/GridBackground/WhatsAppFab)
- Scroll-reveal wrapper → `src/components/Reveal.tsx` (Apple-style IntersectionObserver
  entrance; motion lives in the `.reveal` class in `index.css — reuse it, don't add
  animation libraries. Respects `prefers-reduced-motion`.)
- `Testimonials.tsx` shared strip → `src/components/`
- Icons (no library) → `src/components/icons.tsx`
- Routes → `src/App.tsx`

## Definition of done for a change

- `npm run build` and `npm run lint` pass.
- New UI reuses existing component classes and matches `DESIGN_SYSTEM.md`.
- No hard-coded brand hex or brand strings (use `site.ts` / `brand-*` classes).
# CLAUDE.md — NickBuilds

Guidance for agents working in this repo. Read this first, then
[`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) and [`docs/ROADMAP.md`](docs/ROADMAP.md).

## What this is

Marketing + enquiry site for **NickBuilds** (nickbuilds.xyz), a freelance web studio.
Vite + React 19 + TypeScript + Tailwind v4. Client-side SPA (`react-router-dom`).

The **base layer is done**: theme, layout, header/footer, WhatsApp FAB, routing, and
a fully built **Home** page as the visual reference. All other routes are placeholders
(`src/pages/Placeholder.tsx`) — see the roadmap.

## Non-negotiable conventions

1. **Follow the design system.** The look mirrors a reference SaaS site but with a
   **turquoise** accent. Use the `.card-glass`, `.btn-primary`, `.btn-secondary`,
   `.btn-whatsapp`, `.badge` classes from `src/index.css` and copy patterns from
   `src/pages/Home.tsx`. Don't invent new visual styles.
2. **No raw brand hex.** Use `brand-*` Tailwind classes. The palette lives in the
   `@theme` block of `src/index.css`.
3. **No hard-coded brand strings.** Brand name, WhatsApp number, email, and nav all
   come from `src/config/site.ts`. Update that file, not components.
4. **Two contact channels.** WhatsApp (`whatsappLink()` — already wired) and an
   enquiry form (to be built). Keep both prominent.
5. **Pricing is quote-based**, not fixed tiers. Lead with "Get a Quote".

## Commands

```bash
npm run dev      # dev server, http://localhost:5173
npm run build    # tsc + vite build; run before considering a change done
npm run preview  # serve the production build
```

## Where things live

- Design tokens + component classes → `src/index.css`
- Brand/contact/nav config → `src/config/site.ts`
- Shared shell → `src/components/Layout.tsx` (+ Header/Footer/GridBackground/WhatsAppFab)
- Icons (no library) → `src/components/icons.tsx`
- Routes → `src/App.tsx`

## Definition of done for a change

- `npm run build` passes (typecheck + build).
- New UI reuses existing component classes and matches `DESIGN_SYSTEM.md`.
- No hard-coded brand hex or brand strings.

# DinoSupply — Design System

The look is deliberately modeled on a proven reference site (a clean, modern
SaaS-style layout). We keep **its structure and feel** but swap the accent from
blue to **turquoise**. Read this before adding any UI, and keep it in sync with
`src/index.css`.

## Feel in one line

Light, airy, professional. Soft **slate → turquoise gradient** background with a
faint grid overlay, **frosted-glass cards** (`bg-white/70` + backdrop blur), rounded
corners, and a single confident turquoise accent. Generous whitespace, `Inter`
type, no heavy borders or drop shadows except a gentle hover-lift on cards.

## Color

Brand accent = **turquoise**, defined as a full 50–900 scale in `src/index.css`
under `@theme`. Use it via Tailwind classes: `bg-brand-600`, `text-brand-700`,
`ring-brand-500`, etc. **Never write a raw hex for the accent.**

| Token       | Hex       | Role                                         |
| ----------- | --------- | -------------------------------------------- |
| `brand-50`  | `#f0fbfa` | page gradient tint, subtle fills             |
| `brand-100` | `#d2f5f1` | hover fills, chips                           |
| `brand-500` | `#17a99c` | featured card ring/border                    |
| `brand-600` | `#0d9488` | **primary** — buttons, active nav, checkmarks, badges |
| `brand-700` | `#0c766c` | button hover, active link text               |
| `brand-800` | `#0d5d56` | deep accents                                 |

Neutrals use Tailwind's stock grays:

- Headings: `text-gray-900`
- Body: `text-gray-500` / `text-gray-600`
- Borders: `border-gray-200`
- Muted / footer: `text-gray-400`

Utility colors: WhatsApp green `#25D366` (hover `#1eb955`) — used only for WhatsApp actions.

## Typography

- Family: **Inter** (400/500/600/700), loaded in `index.html`.
- H1 hero: `text-4xl sm:text-5xl font-bold text-gray-900 leading-tight`
- Section H2: `text-2xl sm:text-3xl font-bold text-gray-900`
- Card title: `text-xl font-bold text-gray-900`
- Body: `text-gray-500`, base or `text-lg` for hero subtitles
- Eyebrow / label: `text-xs font-bold uppercase tracking-wider text-brand-600`

## Layout

- Page background: `bg-gradient-to-br from-slate-50 to-brand-50` (set in `Layout.tsx`).
- Fixed faint grid overlay behind content at `z-0`; content sits at `z-10`.
- Content max widths: `max-w-6xl` (page/grid), `max-w-5xl` (bands), `max-w-2xl`/`max-w-3xl` (centered text). Horizontal padding `px-6`.
- Sticky header: `bg-white/85 backdrop-blur-md`, thin bottom border.

## Components (defined in `src/index.css`)

| Class            | What it is                                                             |
| ---------------- | --------------------------------------------------------------------- |
| `.card-glass`    | `rounded-2xl border border-gray-200 bg-white/70 backdrop-blur-xl` + hover-lift |
| `.btn-primary`   | solid turquoise button (`bg-brand-600` → `hover:bg-brand-700`)        |
| `.btn-secondary` | white button with gray border                                         |
| `.btn-whatsapp`  | WhatsApp-green button                                                  |
| `.badge`         | small turquoise pill, uppercase (e.g. "Most popular")                 |

Buttons are `rounded-lg`, cards/bands `rounded-2xl`, badges `rounded-full`.

### Patterns to copy from `Home.tsx`

- **Hero**: centered, badge → H1 → subtitle → primary + WhatsApp CTA row.
- **Card grid**: 3-up glass cards; the featured card gets `border-brand-500 ring-1 ring-brand-500/20` plus a `.badge` pinned to `-top-3 left-1/2 -translate-x-1/2`.
- **Checklist item**: `<CheckIcon className="text-brand-600" />` + `text-gray-700` label.
- **Section heading**: use the `SectionHeading` helper (eyebrow + title + subtitle).
- **CTA band**: a single wide `.card-glass` with centered heading and dual CTAs.

## Icons

Inline SVGs in `src/components/icons.tsx` (Lucide-style, `currentColor`,
`stroke-width: 2` / `2.5` for checks). No icon-library dependency — add new icons
to that file in the same style.

## Do / Don't

- ✅ Reuse the component classes and `site.ts` config.
- ✅ Keep whitespace generous; prefer one accent color per view.
- ❌ Don't introduce a second bright accent, gradients on text, or heavy shadows.
- ❌ Don't hard-code `#0d9488` or the brand name in components.

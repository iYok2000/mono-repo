# UI Components

> Last updated: 2026-07-19
> Shared/reusable components. For design tokens (colors, variants styling) see `design-tokens.md`.

## Shared UI (`apps/web/src/components/ui/`)

| Component | Purpose | Key props / variants |
|-----------|---------|----------------------|
| `Button` | Primary action button | `variant`: primary / secondary / ghost / large / small / pill / link; `fullWidth`; `className` |
| `Card` | Content container | `variant`: default / bordered / elevated / flat / glass / premium; `padding`: none/xs/sm/md/lg |
| `Badge` | Status/label pill | `variant`: primary / success / warning / error / violet / glow / outline; `size`: xs/sm/md/lg |
| `Modal` | Dialog | `isOpen`, `onClose`, `title`, `message`, `type` (success/error/warning/info), `confirmText`, `cancelText`, `onConfirm`, `showCancel` |
| `Switch` | Toggle | `checked`, `onCheckedChange`, `aria-label` |
| `StepCard` | Numbered step card | `number`, `title`, `description`, `icon?` (optional Lucide), `delay?` |
| `Accordion` / `AccordionItem` | Collapsible sections | Item: `title`, `defaultOpen?`, `children` |
| `AnimatedSection` | Scroll-reveal wrapper | `variant` (fade-up / scale-up / ...), `delay?`, `children` |
| `Tabs` | Tabbed content | — |
| `ProductCard` | Product listing card | — |
| `TagBadge` | Tag chip (product tags) | — |
| `ActionButton` | Icon/compact action button | — |
| `CopyButton` | Copy-to-clipboard button | — |
| `LoadingFallback` | Loading spinner + message | `message?` |

## Layout / Decorative

| Component | Path | Purpose |
|-----------|------|---------|
| `LandingSidebar` | `components/layout/LandingSidebar.tsx` | Left nav on landing (desktop), section links + CTA |
| `AdminSidebar` | `components/admin/AdminSidebar.tsx` | Admin nav + logout button |
| `DecorativeImage` | `components/decorative/` | Theme-aware PNG decorations (`/public/decorative/{light\|dark}/`) |
| `BannerCarousel` | `components/banner/BannerCarousel.tsx` | Auto-play banner carousel |

## Landing Sections (`apps/web/src/components/home/`)

Rendered by `app/page.tsx`, each takes `settings` from `home_settings`:
`HeroSection`, `WhatIsItSection`, `SKUSection`, `HowItWorksSection`, `OccasionsSection`,
`WhyNFCSection`, `WhyUsSection` (file `WhyUsNewSection.tsx`), `PreviewSection` (file `WhyUsSection.tsx`), `FAQSection`, `FinalCTASection`.

> Naming quirk: `WhyUsSection.tsx` exports `PreviewSection`; the real WhyUs lives in `WhyUsNewSection.tsx`.

## Admin — Home Settings editor (`components/admin/homeSettings/`)
`SectionEditor`, `ContentField`, `SectionToggle`, `renderFields` — used by `app/admin/home-settings/page.tsx`.

## Notes
- "—" = props not catalogued here; read the component file for the exact interface.

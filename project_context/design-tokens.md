# Design Tokens — GyByte

> Last updated: 2026-04-28
> Only read when doing UI/styling work.

## Brand

- **Name**: GyByte — NFC Digital Business Card & Gift Platform
- **Mascot**: "Byte" — small robot with emerald LED eyes
- **Feel**: Premium, Modern, Friendly, Trustworthy
- **Language**: Thai-first (TH + EN bilingual)

## Colors (Quick Ref)

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#10B981` | CTA, active states |
| Primary hover | `#059669` | Hover |
| BG light | `#F9FAF8` | Page background (warm bone) |
| BG dark | `#0A0A0A` | Dark mode background |
| Card light | `#FFFFFF` | Cards, modals |
| Card dark | `#1F2937` | Dark mode cards |
| Text light | `#1A1A1A` | Primary text |
| Text dark | `#F5F5F5` | Dark mode text |
| Muted light | `#525252` | Secondary text |
| Border light | `#E5E7EB` | Borders |
| Border dark | `#374151` | Dark borders |
| Violet | `#8B5CF6` / `#A78BFA` | Secondary accent |
| Amber | `#FBBF24` | Warm accent |
| Error | `#EF4444` | Errors |

## Typography

| Role | Font | Size | Weight |
|------|------|------|--------|
| Display/Hero | Plus Jakarta Sans | 64px | 800 |
| Heading XL | Plus Jakarta Sans | 48px | 700 |
| Heading LG | Plus Jakarta Sans | 32px | 700 |
| Subheading | Plus Jakarta Sans | 20px | 600 |
| Body | Plus Jakarta Sans | 16px | 400 |
| UI Label | Plus Jakarta Sans | 14px | 500 |
| Caption | Plus Jakarta Sans | 12px | 400 |
| Code | Geist Mono | 14px | 400 |
| Thai body | Anuphan | 16px | 400 |
| Thai heading | Anuphan | 32px | 600 |

**Font stack**: `"Plus Jakarta Sans", "Anuphan", system-ui, sans-serif`

## Layout

- Container max: `1280px` (`max-w-7xl`)
- Card radius: `rounded-2xl` (16px)
- Nav height: ~60px, sticky, `backdrop-blur-md`
- Spacing scale: xs=12, sm=16, md=24, lg=32, xl=48, section-gap=80

## Components

**Buttons**: primary (emerald fill), secondary (border), ghost, large (CTA), pill, link
**Cards**: default, bordered, elevated, flat, glass, premium
**Badges**: primary, success, warning, error, violet, glow, outline (sizes: xs/sm/md/lg)

## Effects

- Glassmorphism: `bg-white/70 backdrop-blur-[12px] border-white/50`
- Glow: `box-shadow: 0 0 40px rgba(16,185,129,0.15)`
- Hover: `translateY(-2px)` + stronger shadow
- Squad gradient: `#EC4899 → #8B5CF6 → #3B82F6` (135deg)

## Theming

- Engine: `next-themes`, default: light, system: enabled
- Dark mode via `.dark` class on `<html>`
- Decorative PNGs: `/public/decorative/{light|dark}/{variant}.png`

## Segment Tiers

silver, gold, diamond, platinum

## Landing Page Sections

hero → what_is_it → sku → how_it_works → occasions → why_nfc → why_us → preview → faq → final_cta

---

> Full YAML token dump: see `DESIGN_CONTEXT.md` (root) for raw values if needed.

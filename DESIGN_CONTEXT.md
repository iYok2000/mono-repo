---
name: 'GyByte: Digital Magic Edition'
colors:
  surface: '#F9FAF8'
  surface-dim: '#dde4dd'
  surface-bright: '#F9FAF8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eef6ee'
  surface-container: '#e8f0e9'
  surface-container-high: '#e3eae3'
  surface-container-highest: '#dde4dd'
  on-surface: '#161d19'
  on-surface-variant: '#3c4a42'
  inverse-surface: '#2b322d'
  inverse-on-surface: '#ebf3eb'
  outline: '#6c7a71'
  outline-variant: '#bbcabf'
  surface-tint: '#10B981'
  primary: '#10B981'
  on-primary: '#ffffff'
  primary-container: '#34D399'
  on-primary-container: '#00422b'
  inverse-primary: '#4edea3'
  secondary: '#8B5CF6'
  on-secondary: '#ffffff'
  secondary-container: '#A78BFA'
  on-secondary-container: '#fffbff'
  tertiary: '#FBBF24'
  on-tertiary: '#ffffff'
  tertiary-container: '#FDE68A'
  on-tertiary-container: '#92400e'
  error: '#EF4444'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#6EE7B7'
  primary-fixed-dim: '#34D399'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#059669'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#7C3AED'
  tertiary-fixed: '#FEF3C7'
  tertiary-fixed-dim: '#FDE68A'
  on-tertiary-fixed: '#410005'
  on-tertiary-fixed-variant: '#D97706'
  background: '#F9FAF8'
  on-background: '#1A1A1A'
  surface-variant: '#dde4dd'
  primary-hover: '#059669'
  primary-soft: 'rgba(16,185,129,0.10)'
  primary-gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 50%, #6EE7B7 100%)'
  background-warm: '#FDFDFB'
  background-dark: '#0A0A0A'
  card-light: '#FFFFFF'
  card-dark: '#1F2937'
  surface-muted-light: '#F5F5F2'
  surface-muted-dark: '#374151'
  foreground-light: '#1A1A1A'
  foreground-dark: '#F5F5F5'
  muted-light: '#525252'
  muted-dark: '#A3A3A3'
  border-light: '#E5E7EB'
  border-dark: '#374151'
  violet-light: '#8B5CF6'
  violet-dark: '#A78BFA'
  amber: '#FBBF24'
  amber-soft: 'rgba(251,191,36,0.15)'
  squad-gradient: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 50%, #3B82F6 100%)'
  focus-ring: 'rgba(16,185,129,0.30)'
  glow-emerald: 'rgba(16,185,129,0.4)'
  glow-violet: 'rgba(167,139,250,0.3)'
  shadow-sm: '0 1px 3px rgba(26,26,26,0.05)'
  shadow-md: '0 8px 30px rgba(26,26,26,0.08)'
  shadow-lg: '0 20px 50px rgba(26,26,26,0.10)'
  shadow-glow: '0 0 40px rgba(16,185,129,0.15)'
  glass-bg: 'rgba(255,255,255,0.7)'
  glass-border: 'rgba(255,255,255,0.5)'
  glass-shadow: '0 8px 32px rgba(31,38,135,0.08)'
  byte-body-light: '#FAFAFA'
  byte-body-dark: '#0F0F0F'
  byte-led: '#10B981'
  byte-glow-light: 'rgba(16,185,129,0.25)'
  byte-glow-dark: 'rgba(16,185,129,0.6)'
typography:
  display-hero:
    fontFamily: Plus Jakarta Sans
    fontSize: 64px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  heading-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
  heading-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.25'
  subheading:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.5'
  body-base:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  ui-label:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
  caption:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
  mono-code:
    fontFamily: Geist Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  body-thai:
    fontFamily: Anuphan
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  heading-thai:
    fontFamily: Anuphan
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  '2xl': 1rem
  full: 9999px
spacing:
  container-max: 1280px
  xs: 12px
  sm: 16px
  md: 24px
  lg: 32px
  xl: 48px
  section-gap: 80px
  nav-height: 60px
---

# DESIGN_CONTEXT.md

> Design System Reference — for Stitch AI / Design Handoff
> Project: **GyByte** | NFC Digital Business Card & Gift Platform

---

## 1. Brand Identity

| | |
|---|---|
| **Brand Name** | GyByte |
| **Mascot** | "Byte" — small friendly robot with emerald LED eyes |
| **Product Type** | NFC Digital Business Card / Gift Platform |
| **Language** | Thai-first (TH + EN bilingual) |
| **Target Feel** | Premium · Modern · Friendly · Trustworthy |

### Logo
- Square emerald background (`#10B981`) with rounded corners (`rounded-lg`)
- White bold letter **"G"** centered
- Followed by wordmark **"GyByte"** in semibold

---

## 2. Color Palette

### Brand / Primary

| Token | Hex | Usage |
|---|---|---|
| `--primary` | `#10B981` | Main CTA, active states, brand accent |
| `--primary-hover` | `#059669` | Hover state for primary |
| `--primary-soft` | `rgba(16,185,129,0.10)` | Soft tinted backgrounds |
| `--primary-gradient` | `#10B981 → #34D399 → #6EE7B7` | Gradient (135deg) |
| `--focus-ring` | `rgba(16,185,129,0.30)` | Focus outline |

### Backgrounds & Surfaces (Light Mode)

| Token | Hex | Usage |
|---|---|---|
| `--background` | `#F9FAF8` | Page background — "Warm Bone Premium Paper" |
| `--background-warm` | `#FDFDFB` | Slightly warmer variant |
| `--card` | `#FFFFFF` | Cards, modals |
| `--surface` | `#FFFFFF` | Input surfaces |
| `--surface-muted` | `#F5F5F2` | Subtle backgrounds, disabled |

### Backgrounds & Surfaces (Dark Mode)

| Token | Hex | Usage |
|---|---|---|
| `--background` | `#0A0A0A` | Page background |
| `--card` | `#1F2937` | Cards |
| `--surface` | `#1F2937` | Input surfaces |
| `--surface-muted` | `#374151` | Subtle backgrounds |

### Text

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--foreground` | `#1A1A1A` | `#F5F5F5` | Primary text |
| `--foreground-hover` | `#0A0A0A` | `#FFFFFF` | Hover text |
| `--muted` | `#525252` | `#A3A3A3` | Secondary / caption text |
| `--subtle` | `#737373` | `#737373` | Placeholder, tertiary text |

### Borders

| Token | Light | Dark |
|---|---|---|
| `--border` | `#E5E7EB` | `#374151` |
| `--border-hover` | `#D1D5DB` | `#4B5563` |

### Accent Colors

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--violet` | `#8B5CF6` | `#A78BFA` | Secondary accent |
| `--amber` | `#FBBF24` | `#FBBF24` | Warm emotional accent |
| `--amber-soft` | `rgba(251,191,36,0.15)` | — | Soft amber tint |

### Status Colors

| Token | Hex | Usage |
|---|---|---|
| `--success` | `#10B981` | Success states |
| `--warning` | `#F59E0B` | Warnings |
| `--error` | `#EF4444` | Errors / destructive |

### Squad Gradient (Special)

```
Pink → Purple → Blue
#EC4899 → #8B5CF6 → #3B82F6 (135deg)
```
Light mode: `#EC4899 / #8B5CF6 / #3B82F6`
Dark mode: `#F472B6 / #A78BFA / #60A5FA`

### Shadows

| Token | Value |
|---|---|
| `--shadow-sm` | `0 1px 3px rgba(26,26,26,0.05)` |
| `--shadow-md` | `0 8px 30px rgba(26,26,26,0.08)` |
| `--shadow-lg` | `0 20px 50px rgba(26,26,26,0.10)` |
| `--shadow-glow` | `0 0 40px rgba(16,185,129,0.15)` |

---

## 3. Typography

### Font Stack

| Font | Language | Weight Range | Usage |
|---|---|---|---|
| **Plus Jakarta Sans** | English | 200–800 | Primary font — Modern Geometric Humanist |
| **Anuphan** | Thai | 100–700 | Thai font — Modern Sans with Human Touch |
| **Geist Mono** | Code | Default | Code blocks, monospace |

### Font Tokens

```css
--font-sans:    "Plus Jakarta Sans", "Anuphan", system-ui, sans-serif;  /* default */
--font-en:      "Plus Jakarta Sans", system-ui, sans-serif;
--font-th:      "Anuphan", "Noto Sans Thai", sans-serif;
--font-display: "Plus Jakarta Sans", "Anuphan", system-ui, sans-serif;
--font-mono:    "Geist Mono", ui-monospace, monospace;
```

### Font Weight Scale

| Token | Value | Usage |
|---|---|---|
| Regular | 400 | Body text |
| Medium | 500 | UI labels |
| Semibold | 600 | Subheadings |
| Bold | 700 | Headings |
| Extrabold | 800 | Hero / Display |

---

## 4. Special Visual Effects

### Glassmorphism
```css
background: rgba(255, 255, 255, 0.7);
border: 1px solid rgba(255, 255, 255, 0.5);
backdrop-filter: blur(12px);
box-shadow: 0 8px 32px rgba(31, 38, 135, 0.08);
```

### Premium Card Effects
- **Light**: Pearl White gradient + subtle fractal noise texture (3% opacity)
- **Dark**: Matte Black `#0A0A0A` + Spot UV emerald green accent + faint specular shine

### Glow Effects (Dark Mode)
```css
--glow-violet:   rgba(167, 139, 250, 0.3)
--glow-emerald:  rgba(16, 185, 129, 0.4)
```

### Warm Accent Line
```css
linear-gradient(90deg, transparent 0%, #FBBF24 50%, transparent 100%)
```
Used as a decorative separator / emotional highlight.

---

## 5. UI Components

### Button

| Variant | Style Description |
|---|---|
| `primary` | Emerald fill, white text, glow shadow, lift on hover |
| `secondary` | White/surface fill, border, subtle muted hover |
| `ghost` | Transparent, muted text, surface hover |
| `large` | Hero CTA — large emerald, 200px min-width, strong glow |
| `small` | Dark fill, compact — used in product cards |
| `pill` | Rounded-full, border, emerald text on hover |
| `link` | Text-only, emerald, underline on hover |

**Micro-interactions:**
- Hover: `translateY(-2px)` + stronger shadow
- Active: `scale(0.98)` + return to baseline
- Disabled: `opacity-50`, `cursor-not-allowed`

### Card

| Variant | Description |
|---|---|
| `default` | White bg, subtle border, small shadow |
| `bordered` | White bg, 2px emerald/20 border |
| `elevated` | White bg, medium shadow |
| `flat` | Muted bg, no border |
| `glass` | Glassmorphism effect |
| `premium` | Dark-optimized, glow border, overflow-hidden |

**Padding scale:** `none / xs(12px) / sm(16px) / md(24px) / lg(32px)`

**Border radius:** `rounded-2xl` (16px) standard across all cards

### Badge

| Variant | Colors |
|---|---|
| `primary` | Emerald soft bg + emerald text |
| `success` | Emerald tint |
| `warning` | Amber tint |
| `error` | Red tint |
| `violet` | Violet tint |
| `glow` | Solid emerald + glow shadow |
| `outline` | Transparent bg + muted border |

**Sizes:** `xs / sm / md / lg`

---

## 6. Layout & Spacing

### Container
- Max width: `max-w-7xl` (1280px)
- Horizontal padding: `px-6 lg:px-8`

### Navigation (Header)
- Sticky top, `z-50`
- `backdrop-blur-md` + `bg-[--card]/80` (frosted glass nav)
- Border bottom: `border-[--border]`
- Height: ~60px (`py-3`)

### Page Structure
```
<Header sticky>
  <BodyLayout>
    <main relative min-h-screen bg-[--background]>
      <DecorativeImage theme-main opacity=0.03 />
      [sections...]
    </main>
  </BodyLayout>
```

---

## 7. Decorative System

Theme-aware PNG decorations — auto-switch light/dark:

| Variant | Position | Default Size | Purpose |
|---|---|---|---|
| `theme-main` | Fixed center | 600×600 | Full-page atmosphere BG |
| `top-right` | Fixed top-right | 320×320 | Corner decoration |
| `bottom-left` | Bottom-left | 450×450 | Section anchor decoration |
| `top-center` | Header center | 150×150 | Logo/mascot area |
| `decoration` | Floating mid-right | 300×300 | Content accent |

Files at: `/public/decorative/{light|dark}/{variant}.png`

---

## 8. Mascot — "Byte"

| Token | Light | Dark | Description |
|---|---|---|---|
| `--byte-body` | `#FAFAFA` | `#0F0F0F` | Main body color |
| `--byte-body-light` | `#FFFFFF` | `#1A1A1A` | Body highlight |
| `--byte-led` | `#10B981` | `#10B981` | LED / eye accent (always emerald) |
| `--byte-glow` | `rgba(16,185,129,0.25)` | `rgba(16,185,129,0.6)` | Glow around LED |
| `--byte-body-shadow` | `#E5E7EB` | — | Soft shadow under body |

---

## 9. Theming

- Engine: `next-themes`
- Default: `light`
- System: enabled (`enableSystem`)
- Toggle: custom `<ThemeSwitchToggle>` component
- Applied via `.dark` class on `<html>`

---

## 10. Accessibility & Motion

- `prefers-reduced-motion` — all animations cut to 0.01ms
- Font rendering: `antialiased`
- Focus ring: emerald `rgba(16,185,129,0.30)`
- Mobile: Desktop-first — `<MobileNotSupported>` shown on small screens

---

## 11. Product Tiers (Segment)

Used for product/membership badge labeling:

| Key | Label |
|---|---|
| `silver` | เงิน |
| `gold` | ทอง |
| `diamond` | เพชร |
| `platinum` | แพลตินัม |

---

## 12. Page Sections (Home)

Current landing page flow:
1. **HeroSection** — Main CTA
2. **WhatIsItSection** — Product explanation
3. **SKUSection** — Product tier selection
4. **HowItWorksSection** — Step-by-step
5. **OccasionsSection** — Use cases
6. **WhyNFCSection** — NFC value prop
7. **WhyUsSection** — Differentiation
8. **PreviewSection** — Examples / showcase
9. **FAQSection** — Questions
10. **FinalCTASection** — Conversion close

---

## Quick Reference — Design Tokens Cheatsheet

```
PRIMARY:       #10B981  (Emerald)
PRIMARY DARK:  #059669
BG LIGHT:      #F9FAF8  (Warm Bone)
BG DARK:       #0A0A0A
TEXT LIGHT:    #1A1A1A
TEXT DARK:     #F5F5F5
BORDER LIGHT:  #E5E7EB
BORDER DARK:   #374151
VIOLET:        #8B5CF6 / #A78BFA
AMBER:         #FBBF24
RADIUS:        16px (rounded-2xl) standard
FONT EN:       Plus Jakarta Sans
FONT TH:       Anuphan
FONT MONO:     Geist Mono
```
